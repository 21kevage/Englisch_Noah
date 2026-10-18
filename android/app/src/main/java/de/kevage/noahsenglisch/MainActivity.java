package de.kevage.noahsenglisch;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Base64;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import java.io.IOException;
import java.io.OutputStream;

/** A deliberately small, offline wrapper around the bundled learning app. */
public class MainActivity extends Activity {
    private static final int OPEN_DOCUMENT = 41;
    private static final int CREATE_DOCUMENT = 42;

    private WebView webView;
    private ValueCallback<Uri[]> filePickerCallback;
    private byte[] pendingExport;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        webView = new WebView(this);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setMediaPlaybackRequiresUserGesture(false);

        webView.addJavascriptInterface(new AndroidBridge(), "AndroidBridge");
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                // The web version keeps its iPhone share-sheet export. In the APK, replace
                // it with Android's file picker because WebView cannot save Blob URLs reliably.
                view.evaluateJavascript("(function(){var old=window.deliver;window.deliver=async function(text,name){try{AndroidBridge.saveTextFile(btoa(unescape(encodeURIComponent(text))),name);return;}catch(e){return old(text,name);}};var note=document.getElementById('offline');if(note)note.textContent='Diese Android-App funktioniert vollständig offline. Sicherungen kannst du im Elternbereich als Datei speichern.';})();", null);
            }
        });
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback,
                                             FileChooserParams params) {
                if (filePickerCallback != null) {
                    filePickerCallback.onReceiveValue(null);
                }
                filePickerCallback = callback;
                try {
                    Intent picker = params.createIntent();
                    picker.addCategory(Intent.CATEGORY_OPENABLE);
                    startActivityForResult(Intent.createChooser(picker, "Vokabeldatei auswählen"), OPEN_DOCUMENT);
                } catch (Exception error) {
                    filePickerCallback = null;
                    Toast.makeText(MainActivity.this, "Dateiauswahl nicht verfügbar", Toast.LENGTH_SHORT).show();
                }
                return true;
            }
        });
        setContentView(webView);
        webView.loadUrl("file:///android_asset/index.html");
    }

    @Override
    @SuppressWarnings("deprecation")
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == OPEN_DOCUMENT) {
            if (filePickerCallback != null) {
                filePickerCallback.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(resultCode, data));
                filePickerCallback = null;
            }
            return;
        }
        if (requestCode == CREATE_DOCUMENT) {
            if (resultCode == RESULT_OK && data != null && data.getData() != null && pendingExport != null) {
                try (OutputStream output = getContentResolver().openOutputStream(data.getData())) {
                    output.write(pendingExport);
                    Toast.makeText(this, "Sicherung gespeichert.", Toast.LENGTH_SHORT).show();
                } catch (IOException error) {
                    Toast.makeText(this, "Sicherung konnte nicht gespeichert werden.", Toast.LENGTH_LONG).show();
                }
            }
            pendingExport = null;
        }
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onDestroy() {
        if (filePickerCallback != null) {
            filePickerCallback.onReceiveValue(null);
            filePickerCallback = null;
        }
        if (webView != null) {
            webView.destroy();
        }
        super.onDestroy();
    }

    private final class AndroidBridge {
        @JavascriptInterface
        public void saveTextFile(String encodedText, String filename) {
            try {
                final byte[] bytes = Base64.decode(encodedText, Base64.DEFAULT);
                runOnUiThread(() -> {
                    pendingExport = bytes;
                    Intent save = new Intent(Intent.ACTION_CREATE_DOCUMENT);
                    save.addCategory(Intent.CATEGORY_OPENABLE);
                    save.setType("application/json");
                    save.putExtra(Intent.EXTRA_TITLE, filename);
                    startActivityForResult(save, CREATE_DOCUMENT);
                });
            } catch (IllegalArgumentException error) {
                runOnUiThread(() -> Toast.makeText(MainActivity.this, "Sicherung konnte nicht vorbereitet werden.", Toast.LENGTH_LONG).show());
            }
        }
    }
}

package de.kevage.noahsenglisch;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.util.Base64;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import java.io.IOException;
import java.io.OutputStream;
import java.util.Locale;

/** A deliberately small, offline wrapper around the bundled learning app. */
public class MainActivity extends Activity {
    private static final int OPEN_DOCUMENT = 41;
    private static final int CREATE_DOCUMENT = 42;

    private WebView webView;
    private ValueCallback<Uri[]> filePickerCallback;
    private byte[] pendingExport;
    private TextToSpeech textToSpeech;
    private boolean ttsReady;
    private String queuedSpeech;
    private String queuedLanguage;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        webView = new WebView(this);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(false);
        settings.setAllowUniversalAccessFromFileURLs(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setMediaPlaybackRequiresUserGesture(false);

        textToSpeech = new TextToSpeech(this, status -> {
            ttsReady = status == TextToSpeech.SUCCESS;
            if (ttsReady && queuedSpeech != null) {
                speak(queuedSpeech, queuedLanguage);
                queuedSpeech = null;
                queuedLanguage = null;
            }
        });

        webView.addJavascriptInterface(new AndroidBridge(), "AndroidBridge");
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                // The JavaScript bridge is available only to this bundled local app.
                return !request.getUrl().toString().startsWith("file:///android_asset/");
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                if (!url.startsWith("file:///android_asset/")) {
                    return;
                }
                // The web version keeps its iPhone share-sheet export. In the APK, replace
                // it with Android's file picker. Android's system voice also replaces the
                // browser speech API, which is not implemented consistently by WebView.
                view.evaluateJavascript("(function(){var oldDeliver=window.deliver;window.deliver=async function(text,name){try{AndroidBridge.saveTextFile(btoa(unescape(encodeURIComponent(text))),name);return;}catch(e){return oldDeliver(text,name);}};var oldSpeak=window.speak;window.speak=function(text,lang){try{AndroidBridge.speakText(String(text||''),String(lang||'en-GB'));}catch(e){return oldSpeak(text,lang);}};var note=document.getElementById('offline');if(note)note.textContent='Diese Android-App funktioniert vollständig offline. Vorlesen und Sicherungen nutzen die Systemfunktionen deines Geräts.';})();", null);
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
        if (textToSpeech != null) {
            textToSpeech.stop();
            textToSpeech.shutdown();
        }
        super.onDestroy();
    }

    private void speak(String text, String languageTag) {
        if (text == null || text.isBlank() || text.length() > 2000) {
            return;
        }
        if (!ttsReady) {
            queuedSpeech = text;
            queuedLanguage = languageTag;
            return;
        }
        Locale locale = Locale.forLanguageTag(languageTag == null ? "en-GB" : languageTag);
        if (textToSpeech.isLanguageAvailable(locale) < TextToSpeech.LANG_AVAILABLE) {
            locale = "de".equals(locale.getLanguage()) ? Locale.GERMAN : Locale.UK;
        }
        int result = textToSpeech.setLanguage(locale);
        if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
            Toast.makeText(this, "Diese Systemstimme ist auf dem Gerät nicht verfügbar.", Toast.LENGTH_LONG).show();
            return;
        }
        textToSpeech.setSpeechRate(0.85f);
        textToSpeech.speak(text, TextToSpeech.QUEUE_FLUSH, null, "noah-english-speech");
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

        @JavascriptInterface
        public void speakText(String text, String languageTag) {
            runOnUiThread(() -> speak(text, languageTag));
        }
    }
}

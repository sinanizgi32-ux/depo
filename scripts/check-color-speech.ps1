$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Speech
$colorTestDir=Join-Path (Split-Path $PSScriptRoot -Parent) 'outputs/color-speech-check'
New-Item -ItemType Directory -Force $colorTestDir | Out-Null
$synth=New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.SelectVoice('Microsoft Tolga')
$format=New-Object System.Speech.AudioFormat.SpeechAudioFormatInfo(16000,[System.Speech.AudioFormat.AudioBitsPerSample]::Sixteen,[System.Speech.AudioFormat.AudioChannel]::Mono)
$records=@()
foreach($word in @('kırmızı','mavi','sarı','yeşil')){
 $wavePath=Join-Path $colorTestDir ($word+'.wav')
 $synth.SetOutputToWaveFile($wavePath,$format)
 $synth.Speak($word)
 $synth.SetOutputToNull()
 $response=Invoke-RestMethod -Uri 'http://127.0.0.1:4180/api/transcribe' -Method Post -InFile $wavePath -ContentType 'audio/wav' -Headers @{Origin='http://127.0.0.1:4180';Referer='http://127.0.0.1:4180/color-teaching.html';'X-Teaching-Domain'='colors'}
 $records+=@{expected=$word;response=$response}
}
$synth.Dispose()
$records|ConvertTo-Json -Depth 5|Set-Content -Encoding utf8 (Join-Path $colorTestDir 'results.json')
$records|ConvertTo-Json -Depth 5 -Compress

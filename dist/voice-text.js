/* Split only at sentence boundaries, never inside a word or an ordinal. */
window.VoiceText={canonical(text){return String(text).normalize('NFC').toLocaleLowerCase('tr').replace(/\s+/g,' ').trim();},units(text){
 return String(text).trim().split(/(?<=\p{L}[.!?])\s+/u).filter(Boolean);
}};

import { createAvatar } from '@dicebear/core';
import { adventurer, shapes } from '@dicebear/collection';

// Gli avatar sono generati qui nel browser, non richiesti a un servizio esterno:
// nessun terzo vede l'indirizzo IP di chi visita il sito.
// Le versioni di @dicebear/core e @dicebear/collection sono fissate a 7.2.0,
// che produce byte per byte gli stessi disegni della vecchia api.dicebear.com/7.x:
// gli avatar scelti dagli utenti registrati restano identici.

// Lo stesso seed compare in piu' punti della stessa pagina (classifica, navbar,
// profilo), quindi il risultato si tiene in cache invece di rigenerarlo.
const cache = new Map();

export function getAvatarUrl(seed) {
  const safeSeed = seed || 'shape_default';

  if (cache.has(safeSeed)) {
    return cache.get(safeSeed);
  }

  const style = safeSeed.startsWith('shape_') ? shapes : adventurer;
  // toDataUri() di questa versione e' asincrona e restituirebbe una Promise
  // dentro l'attributo src: toString() e' sincrona e da' direttamente l'SVG.
  const svg = createAvatar(style, { seed: safeSeed }).toString();
  const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

  cache.set(safeSeed, dataUri);
  return dataUri;
}

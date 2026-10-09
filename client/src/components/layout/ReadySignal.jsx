import { useEffect } from 'react';

// Monté uniquement quand la première page est réellement affichée (auth vérifiée, code de la page chargé) :
// signale à l'écran d'ouverture qu'il peut se retirer.
export default function ReadySignal() {
  useEffect(() => {
    window.__vsbcReady = true;
    window.dispatchEvent(new CustomEvent('vsbc:ready'));
  }, []);
  return null;
}

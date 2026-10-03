import AudioManager from './AudioManager';

export const playCrystalCrackAndBlast = () => AudioManager.playCrystalCrackAndBlast();
export const playCrystalReform = () => AudioManager.playCrystalReform();
export const playRocketBoost = () => AudioManager.playRocketBoost();
export const playRocketPulse = (pulseIndex) => AudioManager.playRocketPulse(pulseIndex);
export const playProjectileBurst = () => AudioManager.playProjectileBurst();
export const playShootingStar = () => AudioManager.playShootingStar();
export const toggleMute = () => AudioManager.toggleMute();
export const setMuted = (muted) => AudioManager.setMuted(muted);
export const getMuted = () => AudioManager.getMuted();

export default AudioManager;

import { AdMob, RewardAdPluginEvents, AdmobConsentStatus } from '@capacitor-community/admob';

const TEST_APP_ID = 'ca-app-pub-3940256099942544~3347511713';
const REWARDED_AD_UNIT = 'ca-app-pub-3940256099942544/5224354917';

let initialized = false;

export async function initAds() {
  if (initialized) return;
  try {
    await AdMob.initialize({
      testingDevices: [],
      initializeForTesting: true,
    });
    initialized = true;
    console.log('AdMob initialized');
  } catch (e) {
    console.warn('AdMob init failed:', e);
  }
}

function showRewardedAd() {
  return new Promise(async (resolve) => {
    if (!initialized) {
      resolve(false);
      return;
    }

    let rewarded = false;

    const rewardListener = AdMob.addListener(RewardAdPluginEvents.Rewarded, () => {
      rewarded = true;
    });

    const dismissListener = AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
      rewardListener.remove();
      dismissListener.remove();
      failListener.remove();
      resolve(rewarded);
    });

    const failListener = AdMob.addListener(RewardAdPluginEvents.FailedToShow, () => {
      rewardListener.remove();
      dismissListener.remove();
      failListener.remove();
      resolve(false);
    });

    try {
      await AdMob.prepareRewardVideoAd({ adId: REWARDED_AD_UNIT });
      await AdMob.showRewardVideoAd();
    } catch (e) {
      console.warn('Rewarded ad error:', e);
      rewardListener.remove();
      dismissListener.remove();
      failListener.remove();
      resolve(false);
    }
  });
}

export async function showReviveAd() {
  return showRewardedAd();
}

export async function showDoubleCreditsAd() {
  return showRewardedAd();
}

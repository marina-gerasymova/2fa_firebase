import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import * as fba from 'firebase/auth'
export default {
  state: {
    recaptchaVerifier: null,
    regState: 0
  },
  getters: {
    regState: state => state.regState
  },
  mutations: {},
  actions: {
    async register(_, { email, password }) {
      const auth = getAuth();
      await createUserWithEmailAndPassword(auth, email, password);
      fba.sendEmailVerification(auth.currentUser).then(() => {
        alert('На вашу пошту було відправленно посилання для підтвердження')
      })
    },
    async mfa({ state }) {
      state.recaptchaVerifier = new fba.RecaptchaVerifier('recaptcha-container', {
        size: 'invisible',
        callback: () => {
          console.log('callback 1', state.regState)
          state.regState = 1
          console.log('callback 2', state.regState)
          // reCAPTCHA solved, you can proceed with phoneAuthProvider.verifyPhoneNumber(...).
        }
        }, getAuth());
      console.log(state.recaptchaVerifier)
      state.recaptchaVerifier.verify()
    },
    async afterRecaptcha({ state }, { number }) {
      const user = getAuth().currentUser
      console.log(user, getAuth())
      return fba.multiFactor(user).getSession().then(function(multiFactorSession) {
        // Specify the phone number and pass the MFA session.
        var phoneInfoOptions = {
          phoneNumber: number,
          session: multiFactorSession
        };
        var phoneAuthProvider = new fba.PhoneAuthProvider(getAuth());
        // Send SMS verification code.
        console.log('params', phoneInfoOptions, state.recaptchaVerifier)
        return phoneAuthProvider.verifyPhoneNumber(
            phoneInfoOptions, state.recaptchaVerifier, getAuth());
      })
    },
    async verify_2fa(_, { promise, code }) {
      const auth = getAuth()
      const user = auth.currentUser
      promise.then(function(verificationId) {
        // Ask user for the verification code.
        var cred = fba.PhoneAuthProvider.credential(verificationId, code);
        var multiFactorAssertion = fba.PhoneMultiFactorGenerator.assertion(cred);
        // Complete enrollment.
        return fba.multiFactor(user).enroll(multiFactorAssertion, 'personal phone number');
      });
    },
    async login({ dispatch }, { email, password }) {
      const auth = getAuth();
      console.log(auth)
      await signInWithEmailAndPassword(auth, email, password).then(() => {
        dispatch('mfa')
      })
    },
    async logout({ commit }) {
      const auth = getAuth();
      await auth.signOut();
      commit("clearInfo");
    },
  },
};

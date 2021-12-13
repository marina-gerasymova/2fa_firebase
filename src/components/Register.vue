<template>
  <div class="row center">
    <div class="col col-6" v-if="step == 1">
      <div class="formWrap">
        <div
          class="regForm"
          autocomplete="off"
        >
          <div class="form-group">
            <input
              type="email"
              v-model="email"
              class="form-control"
              id="email"
              placeholder="Email"
              :class="{
                invalid:
                  ($v.email.$dirty && !$v.email.required) ||
                  ($v.email.$dirty && !$v.email.email),
              }"
            />
            <small
              class="errorIn form-text"
              v-if="$v.email.$dirty && !$v.email.required"
            >
              Введіть свій Email
            </small>
            <small
              class="errorIn form-text"
              v-else-if="$v.email.$dirty && !$v.email.email"
            >
              Приклад: email@gmail.com
            </small>
          </div>
          <div class="form-group">
            <input
              type="password"
              v-model="password"
              class="form-control"
              id="password"
              placeholder="Пароль"
              :class="{
                invalid:
                  ($v.password.$dirty && !$v.password.required) ||
                  ($v.password.$dirty && !$v.password.minLength),
              }"
            />
            <small
              class="errorIn form-text"
              v-if="$v.password.$dirty && !$v.password.required"
            >
              Введіть пароль
            </small>
            <small
              class="errorIn form-text"
              v-else-if="$v.password.$dirty && !$v.password.minLength"
            >
              Ваш пароль має бути не менше ніж
              {{ $v.password.$params.minLength.min }} символів
            </small>
          </div>
          <div class="form-group">
            <input
              type="tel"
              v-model="number"
              class="form-control"
              id="tel"
              placeholder="Номер телефону"
              :class="{
                invalid:
                  ($v.password.$dirty && !$v.password.required) ||
                  ($v.password.$dirty && !$v.password.minLength),
              }"
            />
          </div>
          <div class="form-group form-check">
            <input
              type="checkbox"
              v-model="agreed"
              class="form-check-input"
              id="checkRules"
              :class="{
                invalid:
                  ($v.agreed.$dirty && !$v.agreed.required) ||
                  ($v.agreed.$dirty && !this.agreed),
              }"
            />
            <label class="form-check-label" for="checkRules"
              >Погоджуюсь з <a class="aLink" href="#">правилами</a></label
            >
          </div>
          <button @click="login" class="btn btn-gold">Увійти</button>
          <button @click="register" class="btn btn-gold">Зареєструватися</button>
        </div>
      </div>
    </div>
    <div class="col col-6" v-else>
      <div
        class="regForm"
        autocomplete="off"
      >
        <div class="form-group">
          <input
            type="text"
            v-model="code"
            class="form-control"
            id="name"
            :placeholder="`Введіть код, надісланий на ${number}`"
            :class="{
              invalid:
                ($v.name.$dirty && !$v.name.required) ||
                ($v.name.$dirty && !$v.name.minLength),
            }"
          />
        </div>
        <button @click="sendCode" class="btn btn-gold">Підтвердити код</button>
      </div>
    </div>
    <div class="form-group" style="height: 100px" id="recaptcha-container">
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex' 
import { email, required, minLength } from "vuelidate/lib/validators";
export default {
  data: () => ({
    name: "",
    email: "",
    password: "",
    number: "",
    code: "",
    agreed: false,
    loading: false,
    step: 1,
    mfaPromise: null
  }),
  validations: {
    email: { email, required },
    password: { required, minLength: minLength(8) },
    name: { required, minLength: minLength(1) },
    agreed: { required },
  },
  computed: {
    ...mapGetters([
      'regState'
    ])
  },
  watch: {
    regState(val) {
      console.log('wathc regst', val)
      if (val === 1) {
        this.mfaPromise = this.$store.dispatch('afterRecaptcha', { number: this.number })
        this.step = 2
      }
    }
  },
  methods: {
    async sendCode() {
      await this.$store.dispatch('verify_2fa', { promise: this.mfaPromise, code: this.code }).then(() => {
        alert('Код успішно підтверджено...')
      })
      .catch(e => console.error(e))
      this.$router.push('/about')
    },
    async login() {
      const formData = {
        email: this.email,
        password: this.password,
        number: this.number,
      };
      await this.$store.dispatch("login", formData);
    },
    async register() {

      const formData = {
        email: this.email,
        password: this.password,
        number: this.number
      };
      this.loading = true;
      try {
        await this.$store.dispatch("register", formData);
        // this.$router.push("/profile");
        this.email = "";
        this.name = "";
        this.agreed = false;
        this.password = "";
        this.loading = false;
      } catch (e) {
        this.$v.$reset();
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.center {
  justify-content: center;
}
input.invalid {
  border-bottom: 2px solid red !important;
}
button {
  border-radius: 4px;
  background: #dfdad4;
  margin-left: 20px;
  margin-top: 50px;
}
.form-control {
  margin-bottom: 10px;
}
input[type="checkbox"].invalid {
  outline: 1px solid red;
  outline-offset: 0px;
}
</style>

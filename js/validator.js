// validator.js
import { LicenseType, generateLicense } from "./mobaXtermGenerater.js";

var app = new Vue({
  el: "#app",
  data() {
    return {
      LICENSE_TYPES: LicenseType,

      licenseType: 1,
      userName: "mobaXterm",
      versionName: "24.3",
      userNum: 1,
    };
  },
  methods: {
    setUserName(newVal) {
      this.userName = newVal;
    },
    setVersionName(newVal) {
      this.versionName = newVal;
    },
    setUserNum(newVal) {
      this.userNum = newVal;
    },
    generate() {
      if (!this.userName) {
        alert("Please enter a username");
        return;
      }
      if (!this.versionName) {
        alert("Please enter the version number");
        return;
      }
      if (!this.userNum || this.userNum > 214783647) {
        alert(
          "Please enter a valid number of users (between 1 and 214783647)"
        );
        return;
      }
      // Version split
      let versionNameArr = this.versionName.split(".");
      const majorVersion = parseInt(versionNameArr[0]);
      const minorVersion =
        versionNameArr.length === 2
          ? parseInt(versionNameArr[1]) || 0
          : 0;
      // Generate license string
      let licenseStr = generateLicense(
        this.licenseType,
        this.userName,
        this.userNum,
        majorVersion,
        minorVersion
      );
      this.generateLicenseFile(licenseStr);
    },
    generateLicenseFile(licenseStr) {
      let zip = new JSZip();
      zip.file("Pro.key", licenseStr);
      zip.generateAsync({ type: "blob" }).then(function (content) {
        saveAs(content, "Custom.mxtpro");
      });
    },
  },
  components: {
    "my-input": {
      template: `<div class="my-input">
                              <input :id="idattr" :placeholder="placeholderattr" v-model="value" required/>
                              <div :class="validationTipsDiplay" class="my-input-tips-wrap">
                                  <span class="my-input-tips">{{validationtips}}</span>
                                  <div class="my-input-arrow"></div>
                              </div>
                          </div>`,
      data() {
        return {
          value: this.valueattr,
          validationTipsDiplay: "hide",
          tipsDisplayTimeout: undefined,
        };
      },
      props: {
        idattr: { type: String, default: "" },
        placeholderattr: { type: String, default: "" },
        valueattr: "",
        validation: { type: String, default: "" },
        validationtips: "",
        maxvalue: { type: Number, default: null }, // Adicionado para validar o valor máximo
      },
      watch: {
        valueattr(newVal, oldVal) {
          this.value = newVal;
        },
        value(newVal, oldVal) {
          if (newVal && this.validation) {
            let reg = new RegExp(this.validation);
            if (
              !reg.test(newVal) ||
              (this.maxvalue !== null && parseInt(newVal) > this.maxvalue)
            ) {
              this.validationTipsDiplay = "";
              this.value = oldVal;
              if (this.tipsDisplayTimeout)
                clearTimeout(this.tipsDisplayTimeout);
              var _this = this;
              this.tipsDisplayTimeout = setTimeout(function () {
                _this.tipsDisplayTimeout = undefined;
                _this.validationTipsDiplay = "hide";
              }, 1000);
              return;
            }
          }
          this.$emit("set-data", newVal);
        },
      },
    },
  },
});

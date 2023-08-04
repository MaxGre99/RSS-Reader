import * as yup from "yup";
import onChange from "on-change";
import _ from "lodash";

// Model
const modelState = {
  field: {
    url: "",
  },
  language: "ru",
  errors: {},
  loadingState: false,
  submitted: false,
};

export { modelState };

export default (i18n) => {
  const elements = {
    input: document.querySelector("#url-input"),
    submitButton: document.querySelector('[type="submit"]'),
    list: document.querySelector(".container-fluid.container-xxl.p-5"),
    form: document.querySelector("form"),
    errorField: document.querySelector(".text-danger"),
  };

  const schema = yup.object().shape({
    url: yup.string().trim().required().url(),
  });

  const validate = (fields) => {
    const promise = schema.validate(fields, { abortEarly: false });
    return promise;
  };

  // View
  const errorRender = (elements, value) => {
    if (!_.isEmpty(value)) {
      console.log(i18n.t);
      elements.errorField.textContent = i18n.t("linkValidationError");
      elements.input.classList.add("is-invalid");
    } else {
      elements.errorField.textContent = "";
      elements.input.classList.remove("is-invalid");
    }
  };

  const changeState = onChange(modelState, (path, value, previousValue) => {
    if (path === "errors" && !_.isEqual(value, previousValue)) {
      errorRender(elements, value);
    }
  });

  //Controller
  elements.form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputValue = formData.get("url");
    changeState.field.url = inputValue;

    const errors = validate(changeState.field)
      .then(() => {
        changeState.errors = {};
      })
      .catch((error) => {
        changeState.errors = error;
      });
  });
};

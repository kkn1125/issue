"use strict";

import Issue from "../../dist/src/index";

[...document.forms[0].querySelectorAll("input")].forEach((input) => {
  input.addEventListener("invalid", (e) => {
    const target = e.target;
    if (target instanceof HTMLInputElement) {
      document.forms[0].classList.add("was-validated");
    }
  });
});

function handleSubmit(e) {
  e.preventDefault();

  const frm = e.target;

  /** @type {string} */
  const name = frm.username.value;
  /** @type {string} */
  const pwd = frm.userpwd.value;
  /** @type {string} */
  const birth = frm.birth.value;
  /** @type {string} */
  const hobby = frm.hobby.value;

  const validateIssue = Issue.task("validate username value");
  validateIssue.use([name, pwd, birth]);
  validateIssue.pipe((issue, [name, ...other]) => {
    Issue.logger.debug("1");
    if (/[0-9]+/g.test(name)) {
      return other;
    }
    throw new Error("invalide name");
  });

  // const pwdValidateIssue = Issue.task("validate password value");
  // pwdValidateIssue.use([pwd]);
  validateIssue.pipe((issue, [pwd, ...other]) => {
    // 소문자3~4
    Issue.logger.debug("2");
    if (
      /((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])\b[a-z]{3,4}[A-Z]{3,4}[0-9]{3,4}[!@#$%^&*()_\-=+]{1,2}$)/g.test(
        pwd
      )
    ) {
      return other;
    }
    frm.pwd.invalid = true;
    throw new Error("invalide password");
  });

  // const birthValidateIssue = Issue.task("validate password value");
  // birthValidateIssue.use([birth]);
  validateIssue.pipe((issue, [birth]) => {
    Issue.logger.debug("3");
    const result = new Date(birth);
    const isInvalidDate = result.toString().includes("Invalid Date");
    return !isInvalidDate;
  });

  // const nameSolved = Issue.solve(nameValidateIssue);
  // const pwdSolved = Issue.solve(pwdValidateIssue);
  // const birthSolved = Issue.solve(birthValidateIssue);
  const solved = Issue.solve(validateIssue);

  Issue.logger.log("solved", solved);
  Issue.logger.log("solved", solved.result);

  return false;
}

if ("frm" in window) {
  window.frm.addEventListener("submit", handleSubmit);
}

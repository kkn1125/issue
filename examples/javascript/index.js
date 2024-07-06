"use strict";

import Issue from "../../dist/src/index";

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

  const nameValidateIssue = Issue.task("validate username value");
  nameValidateIssue.use([name]);
  nameValidateIssue.pipe((issue, [name]) => /[0-9]+/g.test(name));

  const pwdValidateIssue = Issue.task("validate password value");
  pwdValidateIssue.use([pwd]);
  pwdValidateIssue.pipe((issue, [pwd]) => {
    const result =
      /((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])\b[a-z]{3,4}[0-9]{3,4}[A-Za-z0-9]{5,6}$)/g.test(
        pwd
      );
    console.log(result);
    return result;
  });

  const solved = Issue.solve(pwdValidateIssue);
  console.log("solved", solved);

  // const issue = Issue.task("handle submit");
  // issue.pipe();

  return false;
}

if ("frm" in window) {
  window.frm.addEventListener("submit", handleSubmit);
}

var script = document.createElement("script");

// Set the source attribute to the library URL
script.src =
  "https://unpkg.com/libphonenumber-js@1.10.47/bundle/libphonenumber-min.js";

// Append the script element to the document's head
document.head.appendChild(script);

function initializeForm(form) {
  // Get elements specific to this form
  function createDropdown(labelText, optionsArray, id) {
    var select = form.querySelector(id);
    optionsArray.forEach(function (option) {
      var opt = document.createElement("option");
      opt.value = option;
      opt.innerText = option;
      select.appendChild(opt);
    });
    return { select: select, container: select.parentNode };
  }

  // Get elements specific to this form
  const businessTypeDropdown = createDropdown(
    "Business Type:",
    data.BusinessTypes.map((type) => type.Type),
    "#business-type"
  ).select;
  const turnoverDropdown = createDropdown("Turnover:", [], "#turnover").select;
  const vatDropdown = createDropdown("VAT:", ["Yes", "No"], "#vat-return")
    .select;
  const payrollPrimaryDropdown = createDropdown(
    "Payroll:",
    ["Yes", "No"],
    "#payroll"
  ).select;
  const bookkeepingPrimaryDropdown = createDropdown(
    "Bookkeeping:",
    ["Yes", "No"],
    "#bookkeeping"
  ).select;
  const payrollOptionsDropdown = createDropdown(
    "Payroll Options:",
    Object.keys(data.AdditionalServices.Payroll),
    "#employees"
  ).select;
  const bookkeepingOptionsDropdown = createDropdown(
    "Bookkeeping Transactions:",
    Object.keys(data.AdditionalServices.Bookkeeping),
    "#transaction"
  ).select;
  const selfAssessmentDropdown = createDropdown(
    "Self Assessment:",
    ["Yes", "No"],
    "#self-assessment"
  );
  const yearEndPlanningDropdown = createDropdown(
    "Year End Planning:",
    ["Yes", "No"],
    "#year-end-planning"
  );
  const companySecretarialServicesDropdown = createDropdown(
    "Company Secretarial Services:",
    ["Yes", "No"],
    "#company-services"
  );
  const button = form.querySelector("#form-btn");
  const phoneNumberInput = form.querySelector("#Phone-Number");
  const name = form.querySelector("#Name");
  const email = form.querySelector("#Email");

  // Initially hide the secondary dropdowns
  payrollOptionsDropdown.parentElement.style.display = "none";
  bookkeepingOptionsDropdown.parentElement.style.display = "none";

  // Event listeners to show/hide secondary dropdowns based on primary dropdown value
  payrollPrimaryDropdown.addEventListener("change", function () {
    payrollOptionsDropdown.parentElement.style.display =
      payrollPrimaryDropdown.value === "Yes" ? "block" : "none";
  });

  bookkeepingPrimaryDropdown.addEventListener("change", function () {
    bookkeepingOptionsDropdown.parentElement.style.display =
      bookkeepingPrimaryDropdown.value === "Yes" ? "block" : "none";
  });

  function updateTurnoverOptions() {
    var selectedBusinessType = businessTypeDropdown.value;
    var businessTypeData = data.BusinessTypes.find((type) =>
      type.Type === selectedBusinessType ? selectedBusinessType : "LLP"
    );
    var turnoverOptions = businessTypeData.TurnoverBrackets.map(
      (bracket) => bracket.Bracket
    );
    turnoverDropdown.innerHTML = "";
    turnoverOptions.forEach(function (option) {
      var opt = document.createElement("option");
      opt.value = option;
      opt.innerText = option;
      turnoverDropdown.appendChild(opt);
    });
  }

  function updateDropdownVisibility() {
    var selectedBusinessType = businessTypeDropdown.value;
    selfAssessmentDropdown.container.style.display =
      selectedBusinessType === "Sole Trader" ? "none" : "block";
    yearEndPlanningDropdown.container.style.display =
      selectedBusinessType === "Sole Trader" ? "none" : "block";
    companySecretarialServicesDropdown.container.style.display =
      selectedBusinessType === "Sole Trader" ||
      selectedBusinessType === "Partnership"
        ? "none"
        : "block";
  }

  function loadFormPostSubmission(name, email) {
    (function (C, A, L) {
      let p = function (a, ar) {
        a.q.push(ar);
      };
      let d = C.document;
      C.Cal =
        C.Cal ||
        function () {
          let cal = C.Cal;
          let ar = arguments;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            d.head.appendChild(d.createElement("script")).src = A;
            cal.loaded = true;
          }
          if (ar[0] === L) {
            const api = function () {
              p(api, arguments);
            };
            const namespace = ar[1];
            api.q = api.q || [];
            typeof namespace === "string"
              ? (cal.ns[namespace] = api) && p(api, ar)
              : p(cal, ar);
            return;
          }
          p(cal, ar);
        };
    })(window, "https://app.cal.com/embed/embed.js", "init");

    Cal("init", { origin: "https://cal.com" });

    Cal("inline", {
      elementOrSelector: "#my-cal-inline",
      calLink: "scottcope/30min",
      layout: "month_view",
      config: {
        name: name,
        email: email
      }
    });

    Cal("ui", {
      theme: "light",
      styles: { branding: { brandColor: "#781BFF" } },
      hideEventTypeDetails: false,
      layout: "month_view"
    });

    (function (C, A, L) {
      let p = function (a, ar) {
        a.q.push(ar);
      };
      let d = C.document;
      C.Cal2 =
        C.Cal2 ||
        function () {
          let cal = C.Cal2;
          let ar = arguments;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            d.head.appendChild(d.createElement("script")).src = A;
            cal.loaded = true;
          }
          if (ar[0] === L) {
            const api = function () {
              p(api, arguments);
            };
            const namespace = ar[1];
            api.q = api.q || [];
            typeof namespace === "string"
              ? (cal.ns[namespace] = api) && p(api, ar)
              : p(cal, ar);
            return;
          }
          p(cal, ar);
        };
    })(window, "https://app.cal.com/embed/embed.js", "init");
    Cal("init", "second");
    Cal.ns.second("inline", {
      elementOrSelector: "#my-cal-inline-2",
      calLink: "scottcope/30min",
      layout: "month_view",
      config: {
        name: name,
        email: email
      }
    });
    Cal.ns.second("ui", {
      theme: "light",
      styles: { branding: { brandColor: "#781BFF" } },
      hideEventTypeDetails: false,
      layout: "month_view"
    });
  }

  function calculateTotalFee() {
    const isSecondFormAvailable =
      document.querySelectorAll("#wf-form-Quote-Form").length > 1;
    var selectedBusinessType = businessTypeDropdown.value;
    var selectedTurnover = turnoverDropdown.value;
    var businessTypeData = data.BusinessTypes.find(
      (type) => type.Type === selectedBusinessType
    );
    var turnoverData = businessTypeData.TurnoverBrackets.find(
      (bracket) => bracket.Bracket === selectedTurnover
    );

    var monthlyFee =
      turnoverData.MonthlyFee === "Book a call"
        ? "Book a call"
        : parseFloat(turnoverData.MonthlyFee.slice(1));
    var annualFee =
      monthlyFee === "Book a call" ? "Book a call" : monthlyFee * 12;
    insertElement("Accounts", parseFloat(turnoverData.MonthlyFee.slice(1)));
    insertElementFooter(
      "Accounts",
      parseFloat(turnoverData.MonthlyFee.slice(1))
    );
    // 1. VAT
    if (vatDropdown.value === "Yes" && monthlyFee !== "Book a call") {
      monthlyFee += parseFloat(data.AdditionalServices.VAT.MonthlyFee.slice(1));
      annualFee = monthlyFee * 12;
      const vatFee = parseFloat(
        data.AdditionalServices.VAT.MonthlyFee.slice(1)
      );
      insertElement("VAT", vatFee.toFixed(2));
      insertElementFooter("VAT", vatFee.toFixed(2));
    }
    // 2. payroll
    if (
      payrollPrimaryDropdown.value === "Yes" &&
      monthlyFee !== "Book a call"
    ) {
      var payrollFee =
        data.AdditionalServices.Payroll[payrollOptionsDropdown.value]
          .MonthlyFee;
      if (payrollFee !== "Book a call") {
        monthlyFee += parseFloat(payrollFee.slice(1));
        annualFee = monthlyFee * 12;
        const payrollFeeFinal = parseFloat(payrollFee.slice(1));
        insertElement("Payroll", payrollFeeFinal.toFixed(2));
        insertElementFooter("Payroll", payrollFeeFinal.toFixed(2));
      }
    }
    // 3. Book keeping
    if (
      bookkeepingPrimaryDropdown.value === "Yes" &&
      monthlyFee !== "Book a call"
    ) {
      var bookkeepingFee =
        data.AdditionalServices.Bookkeeping[bookkeepingOptionsDropdown.value]
          .MonthlyFee;
      if (bookkeepingFee !== "Book a call") {
        monthlyFee += parseFloat(bookkeepingFee.slice(1));
        annualFee = monthlyFee * 12;
        const bookeepingFee = parseFloat(bookkeepingFee.slice(1));
        insertElement("Book Keeping", bookeepingFee.toFixed(2));
        insertElementFooter("Book Keeping", bookeepingFee.toFixed(2));
      }
    }
    // 4. self assesment
    if (
      selfAssessmentDropdown.select.value === "Yes" &&
      monthlyFee !== "Book a call"
    ) {
      var selfAssessmentFee = data.AdditionalServices.SelfAssessment.MonthlyFee;
      if (selfAssessmentFee !== "Book a call") {
        monthlyFee += parseFloat(selfAssessmentFee.slice(1));
        annualFee = monthlyFee * 12;
        const selfAssFee = parseFloat(selfAssessmentFee.slice(1));
        insertElement("Self assesment", selfAssFee.toFixed(2));
        insertElementFooter("Self assesment", selfAssFee.toFixed(2));
      }
    }
    // 5. yoe
    if (
      yearEndPlanningDropdown.select.value === "Yes" &&
      monthlyFee !== "Book a call"
    ) {
      var yearEndPlanningFee =
        data.AdditionalServices.YearEndPlanning.MonthlyFee;
      if (yearEndPlanningFee !== "Book a call") {
        monthlyFee += parseFloat(yearEndPlanningFee.slice(1));
        annualFee = monthlyFee * 12;
        const yoeFee = parseFloat(yearEndPlanningFee.slice(1));
        insertElement("Year end planning", yoeFee.toFixed(2));
        insertElementFooter("Year end planning", yoeFee.toFixed(2));
      }
    }
    // 6. csc
    if (
      companySecretarialServicesDropdown.select.value === "Yes" &&
      monthlyFee !== "Book a call"
    ) {
      var companySecretarialServicesFee =
        data.AdditionalServices.CompanySecretarialServices.MonthlyFee;
      if (companySecretarialServicesFee !== "Book a call") {
        monthlyFee += parseFloat(companySecretarialServicesFee.slice(1));
        annualFee = monthlyFee * 12;
        const cssFee = parseFloat(companySecretarialServicesFee.slice(1));
        insertElement("Company Secretarial Services", cssFee.toFixed(2));
        insertElementFooter("Company Secretarial Services", cssFee.toFixed(2));
      }
    }

    if (monthlyFee === "Book a call" || annualFee === "Book a call") {
      hideElementsForBookCall(true);
      const resultDisplay = document.querySelectorAll(".display-text");
      resultDisplay[0].innerHTML = `Book a call`;
      if (isSecondFormAvailable) {
        resultDisplay[1].innerHTML = `Book a call`;
      }
    } else {
      hideElementsForBookCall(false);
      const resultDisplay = document.querySelectorAll(".display-text");
      const finalResult = `£ ${monthlyFee.toFixed(2)}`;
      resultDisplay[0].innerHTML = finalResult;
      document.querySelectorAll(
        ".js--total-cal-value"
      )[0].innerHTML = finalResult;
      if (isSecondFormAvailable) {
        resultDisplay[1].innerHTML = finalResult;
        document.querySelectorAll(
          ".js--total-cal-value"
        )[1].innerHTML = finalResult;
      }
    }
  }

  function validateForm() {
    var dropdowns = [
      businessTypeDropdown,
      turnoverDropdown,
      vatDropdown,
      payrollPrimaryDropdown,
      bookkeepingPrimaryDropdown
    ];

    if (businessTypeDropdown.value === "Partnership") {
      dropdowns.push(
        selfAssessmentDropdown.select,
        yearEndPlanningDropdown.select
      );
    } else if (businessTypeDropdown.value !== "Sole Trader") {
      dropdowns.push(
        selfAssessmentDropdown.select,
        yearEndPlanningDropdown.select,
        companySecretarialServicesDropdown.select
      );
    }

    if (payrollPrimaryDropdown.value === "Yes") {
      dropdowns.push(payrollOptionsDropdown);
    }
    if (bookkeepingPrimaryDropdown.value === "Yes") {
      dropdowns.push(bookkeepingOptionsDropdown);
    }

    var allValid = true;
    dropdowns.forEach(function (dropdown) {
      if (!dropdown.value) {
        dropdown.style.borderColor = "var(--form-error-state)";
        allValid = false;
        dropdown.setCustomValidity("Please select a option");
      } else {
        dropdown.style.borderColor = "";
        dropdown.setCustomValidity("");
      }
    });

    const inputValues = [
      // phoneNumberInput,
      name,
      email
    ];

    inputValues.forEach(function (input) {
      if (!input.value) {
        input.style.borderColor = "var(--form-error-state)";
        allValid = false;
        input.setCustomValidity("Please provide the input");
      } else {
        input.style.borderColor = "";
        input.setCustomValidity("");
      }
    });
    var phoneNumber = phoneNumberInput.value;
    var ukNumberWithCode = phoneNumber.startsWith("+44")
      ? phoneNumber
      : "+44" + phoneNumber;
    var isValidUKNumber = libphonenumber.isValidPhoneNumber(
      ukNumberWithCode,
      "UK"
    );
    if (!isValidUKNumber) {
      allValid = false;
      phoneNumberInput.setCustomValidity(
        "Please enter a valid UK phone number."
      );
      phoneNumberInput.style.borderColor = "var(--form-error-state)";
    } else {
      phoneNumberInput.setCustomValidity("");
      phoneNumberInput.style.borderColor = "";
    }

    if (!allValid) {
      form.reportValidity();
    }
    return allValid;
  }
  updateTurnoverOptions();
  updateDropdownVisibility();
  businessTypeDropdown.addEventListener("change", function () {
    updateTurnoverOptions();
    updateDropdownVisibility();
    clearHiddenElementsError();
  });

  //Phone number validation
  phoneNumberInput.addEventListener("input", function () {
    phoneNumberInput.setCustomValidity("");
    phoneNumberInput.style.borderColor = "";
  });
  phoneNumberInput.addEventListener("blur", function () {
    var phoneNumber = this.value;
    var ukNumberWithCode = phoneNumber.startsWith("+44")
      ? phoneNumber
      : "+44" + phoneNumber;
    var isValidUKNumber = libphonenumber.isValidPhoneNumber(
      ukNumberWithCode,
      "UK"
    );
    if (!isValidUKNumber) {
      this.setCustomValidity("Please enter a valid UK phone number.");
      this.style.borderColor = "var(--form-error-state)";
    } else {
      this.setCustomValidity("");
      this.style.borderColor = "";
    }
  });

  payrollPrimaryDropdown.addEventListener("change", function () {
    payrollOptionsDropdown.parentElement.style.display =
      payrollPrimaryDropdown.value === "Yes" ? "block" : "none";
  });

  bookkeepingPrimaryDropdown.addEventListener("change", function () {
    bookkeepingOptionsDropdown.parentElement.style.display =
      bookkeepingPrimaryDropdown.value === "Yes" ? "block" : "none";
  });

  button.addEventListener("click", function (event) {
    var locationValue = event.target.getAttribute("location");
    var name = document.querySelector(
      'input[input-data="name"][location="' + locationValue + '"]'
    ).value;
    var email = document.querySelector(
      'input[input-data="email"][location="' + locationValue + '"]'
    ).value;
    if (validateForm()) {
      calculateTotalFee();
      loadFormPostSubmission(name, email);
    } else {
      event.preventDefault();
    }
  });
  function checkDropdownValue(dropdown) {
    if (dropdown.value) {
      dropdown.style.borderColor = ""; // Reset border color if it has a value
      dropdown.setCustomValidity("");
    } else {
      dropdown.style.borderColor = "var(--form-error-state)"; // Highlight it with a var(--form-error-state) border if it doesn't have a value
      dropdown.setCustomValidity("Please select an option");
    }
  }
  var allDropdowns = [
    businessTypeDropdown,
    turnoverDropdown,
    vatDropdown,
    payrollPrimaryDropdown,
    bookkeepingPrimaryDropdown,
    payrollOptionsDropdown,
    bookkeepingOptionsDropdown,
    selfAssessmentDropdown.select,
    yearEndPlanningDropdown.select,
    companySecretarialServicesDropdown.select
  ];

  // Add event listener to each dropdown
  allDropdowns.forEach(function (dropdown) {
    dropdown.addEventListener("change", function () {
      checkDropdownValue(dropdown);
    });
  });

  function checkInputValue(input) {
    if (input.value) {
      input.style.borderColor = ""; // Reset border color if it has a value
      input.setCustomValidity("");
    } else {
      input.style.borderColor = "var(--form-error-state)"; // Highlight it with a red border if it doesn't have a value
      input.setCustomValidity("Please input the values");
    }
  }

  var allInputs = [
    // phoneNumberInput,
    name,
    email
  ];
  allInputs.forEach(function (input) {
    input.addEventListener("input", function () {
      checkInputValue(input);
    });
  });

  function clearHiddenElementsError() {
    const dropdowns = [
      selfAssessmentDropdown.select,
      yearEndPlanningDropdown.select,
      companySecretarialServicesDropdown.select
    ];
    dropdowns.forEach(function (input) {
      input.style.borderColor = ""; // Reset border color if it has a value
      input.setCustomValidity("");
    });
  }
}

// Initialize both forms
const forms = document.querySelectorAll("#wf-form-Quote-Form");
forms.forEach(initializeForm);

// for cost breakdown
function insertElement(param1, param2) {
  // Create the new div element
  const newDiv = document.createElement("div");
  newDiv.className = "faq_val-wrap";

  // Create the inner divs and set their content
  const innerDiv1 = document.createElement("div");
  innerDiv1.className = "text-size-title5";
  innerDiv1.textContent = param1;

  const innerDiv2 = document.createElement("div");
  innerDiv2.className = "text-size-title5 text-weight-medium";
  innerDiv2.textContent = `£ ${param2}`;

  // Append the inner divs to the new div
  newDiv.appendChild(innerDiv1);
  newDiv.appendChild(innerDiv2);

  // Select the parent element
  const parentElement = document.querySelectorAll(".faq_answer")[0];
  // Insert the new element at the top
  parentElement.insertBefore(newDiv, parentElement.firstChild);
}

function insertElementFooter(param1, param2) {
  const isSecondFormAvailable =
    document.querySelectorAll("#wf-form-Quote-Form").length > 1;
  if (isSecondFormAvailable) {
    // Create the new div element
    const newDiv = document.createElement("div");
    newDiv.className = "faq_val-wrap";

    // Create the inner divs and set their content
    const innerDiv1 = document.createElement("div");
    innerDiv1.className = "text-size-title5";
    innerDiv1.textContent = param1;

    const innerDiv2 = document.createElement("div");
    innerDiv2.className = "text-size-title5 text-weight-medium";
    innerDiv2.textContent = `£ ${param2}`;

    // Append the inner divs to the new div
    newDiv.appendChild(innerDiv1);
    newDiv.appendChild(innerDiv2);

    // Select the parent element
    const parentElement = document.querySelectorAll(".faq_answer")[1];

    // Insert the new element at the top
    parentElement.insertBefore(newDiv, parentElement.firstChild);
  } else return null;
}

function hideElementsForBookCall(isBookCall) {
  if (isBookCall) {
    // Select elements with 'step-2' attribute equal to 'modal' or 'footer'
    const stepElements = document.querySelectorAll(
      '[step-2="modal"], [step-2="footer"]'
    );

    stepElements.forEach((element) => {
      // Select all child elements regardless of their 'book-call' attribute value
      const bookCallElements = element.querySelectorAll("[book-call]");

      bookCallElements.forEach((child) => {
        if (child.getAttribute("book-call") === "no") {
          // Hide the element if 'book-call' attribute is 'no'
          child.style.display = "none";
        } else if (
          child.getAttribute("book-call") === "yes" ||
          child.getAttribute("book-call") === ""
        ) {
          // Show the element if 'book-call' attribute is 'yes'
          child.style.display = "block";
        }
      });
    });
  }
}

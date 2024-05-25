var myDate = new Date().toLocaleString("en-us", {
  day: "numeric",
  month: "short",
  year: "numeric",
});
document.querySelectorAll("[data-fill-current]").forEach((el) => {
  el.textContent = myDate;
  el.setAttribute("date", myDate);
});


document.querySelector('#contactBox').addEventListener('click', () => {
  document.querySelector('#phoneBox').classList.remove('hidden');
});

function replaceDataOnClick(event) {
  const element = event.target;
  const fieldTitle = element.getAttribute('data-fill');
  const fieldValue = element.textContent;
  const msg = `Enter new value for [ ${fieldTitle} ]`;
  const fieldSelector = `[data-fill='${fieldTitle}']`;

  // Get new value from prompt
  let newVal = window.prompt(msg, fieldValue);

  if (!newVal) {
    newVal = `[${fieldTitle}]`;
  }

  // Replace with new text on all parts of the document
  document.querySelectorAll(fieldSelector).forEach(field => {
    field.textContent = newVal;
    field.setAttribute('data-fill-val', newVal);
  });
}

document.querySelectorAll('[data-fill]').forEach(function (element) {
  element.addEventListener('click', replaceDataOnClick);
});
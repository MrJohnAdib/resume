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

function getResumeVersion() {
  return document.querySelector('#version').textContent;
}

function getPdfLink() {
  const resumeVersion = getResumeVersion();
  const folderPath = './pdf/';
  const resumeFilePrefix = 'MrAdib-Resume-';
  const pdfLink = `${folderPath}${resumeFilePrefix}${resumeVersion}.pdf`;

  return pdfLink;
}

function isFileExists(url) {
  try{
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    const isExists = http.status != 404;
    return isExists;
  }
  catch(err){
    return false;
  }
}

function setPdfButtonLink(link) {
  const pdfBtn = document.querySelector('#pdf-btn');
  const pdfBtnIsHidden = pdfBtn.classList.contains('hidden');
  if (!link) {
    pdfBtn.setAttribute('href', '#');
    if(!pdfBtnIsHidden) {
      pdfBtn.classList.add('hidden');
    }
    return;
  }
  pdfBtn.setAttribute('href', link);
  if(pdfBtnIsHidden) {
    pdfBtn.classList.remove('hidden');
  }
}

function showPdfButton() {
  const pdfLink = getPdfLink();
  const isPdfExists = isFileExists(pdfLink);
  if (isPdfExists) {
    setPdfButtonLink(pdfLink);
  }
  else {
    setPdfButtonLink(null);
  }
}

// on load page show pdf button
showPdfButton();


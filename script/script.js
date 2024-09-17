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

function removeDotsFromVersion(version) {
  return version.replace(/\./g, '');
}

function getResumeVersion() {
  const ver = document.querySelector('#version').textContent;
  return removeDotsFromVersion(ver);
}

function getResumeLatestPdfVersion() {
  const ver = document.querySelector('#version').attributes['data-latest-pdf'].value;
  return removeDotsFromVersion(ver);
}

function getPdfLink(resumeVersion) {
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
    console.log("Error while checking file exists ", err);
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
  const resumeVersion = getResumeVersion();
  const pdfLink = getPdfLink(resumeVersion);
  const isPdfExists = isFileExists(pdfLink);
  if (isPdfExists) {
    setPdfButtonLink(pdfLink);
    return;
  }

  const latestResumeVersion = getResumeLatestPdfVersion();
  const latestPdfLink = getPdfLink(latestResumeVersion);
  const isLatestPdfExists = isFileExists(latestPdfLink);
  if (isLatestPdfExists) {
    setPdfButtonLink(isLatestPdfExists);
    return;
  }

  // If pdf file not exists at all hide the pdf button
  setPdfButtonLink(null);
}

// on load page show pdf button
showPdfButton();


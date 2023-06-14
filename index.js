"use strict";
let observer = null;
let eve = null;
let param = [];
let switcher = false;
let count = 0;

const regions = ["Africa", "Americas", "Asia", "Europe", "Oceania"];
const content = document.getElementById("content");
const header = document.getElementById("header");
const nav = document.getElementById("nav");
const select = document.getElementById("form__select");
const search = document.getElementById("form__control");
const btnDarkMode = document.querySelector(".darkmode");
const title = document.querySelector(".title");
const ionHeader = document.querySelector(".ion_header");

const detailCountry = async (cca3) => {
  eve = "detail";
  param.push(cca3);
  const country = await findCountry(cca3);
  while (nav.children.length > 0) nav.removeChild(nav.lastChild);

  while (content.children.length > 0) content.removeChild(content.lastChild);

  const backbtn = document.createElement("button");
  backbtn.classList.add("btn", "back");
  backbtn.innerHTML = '<ion-icon name="arrow-back-outline"></ion-icon>Back';
  if (switcher) backbtn.classList.add("btnDark");
  backbtn.addEventListener("click", () => {
    eve = "back";
    while (content.children.length > 0) content.removeChild(content.lastChild);
    count = 0;
    if (eve === "back" && param.length > 1) {
      detailCountry(param[param.length - 2]);
      param.pop();
      param.pop();
    } else {
      createNavContent();
      showAllCountries(10, giveInfo);
      param.length = 0;
    }
  });

  nav.appendChild(backbtn);

  const img = document.createElement("img");
  img.src = country.flags.png;
  img.style.animation = "show 2s forwards";

  const infoContainer = document.createElement("div");
  infoContainer.style.animation = "show 2s forwards";
  infoContainer.classList.add("detail-container");

  const h2 = document.createElement("h2");
  h2.textContent = country.name.common;

  const information = document.createElement("div");
  information.classList.add("information");

  const infoLeft = document.createElement("div");
  infoLeft.classList.add("info-left");
  const pnn = document.createElement("p");
  pnn.textContent = "Native name:";
  const pp = document.createElement("p");
  pp.textContent = "Population:";
  const pr = document.createElement("p");
  pr.textContent = "Region:";
  const psr = document.createElement("p");
  psr.textContent = "Sub Region:";
  const pc = document.createElement("p");
  pc.textContent = "Capital:";
  const ptld = document.createElement("p");
  ptld.textContent = "Top Level Domain:";
  const pcur = document.createElement("p");
  pcur.textContent = "Currencies:";
  const plang = document.createElement("p");
  plang.textContent = "Languages:";
  const pb = document.createElement("p");
  pb.textContent = "Border Countries:";

  const paragraphs = [pnn, pp, pr, psr, pc, ptld, pcur, plang, pb];
  if (switcher) {
    h2.style.color = "#fff";
    for (const p of paragraphs) p.style.color = "#fff";
  }

  const snn = document.createElement("span");
  snn.textContent = country.name.official;
  const sp = document.createElement("span");
  sp.textContent = country.population.toLocaleString("en-US");
  const sr = document.createElement("span");
  sr.textContent = country.region;
  const ssr = document.createElement("span");
  ssr.textContent = country.subregion;
  const sc = document.createElement("span");
  sc.textContent = country.capital;
  pnn.appendChild(snn);
  pp.appendChild(sp);
  pr.appendChild(sr);
  psr.appendChild(ssr);
  pc.appendChild(sc);

  const infoRigth = document.createElement("div");
  infoRigth.classList.add("info-rigth");
  const stld = document.createElement("span");
  if (country.tld != undefined) stld.textContent = country.tld[0];
  const scur = document.createElement("span");

  if (country.currencies != undefined) {
    const kcur = Object.keys(country.currencies);
    for (let i = 0; i < kcur.length; i++) {
      if (kcur.length - 1 == i) {
        scur.textContent += `${country.currencies[kcur[i]].name}`;
      } else scur.textContent += `${country.currencies[kcur[i]].name}` + ", ";
    }
  }
  const slang = document.createElement("span");

  if (country.languages != undefined) {
    const klang = Object.keys(country.languages);
    for (const l of klang) {
      if (klang.length - 1 == klang.indexOf(l))
        slang.textContent += `${country.languages[l]}`;
      else slang.textContent += `${country.languages[l]}` + ", ";
    }
  }
  ptld.appendChild(stld);
  pcur.appendChild(scur);
  plang.appendChild(slang);

  const border = document.createElement("div");
  border.classList.add("border");
  border.appendChild(pb);
  if (country.borders != undefined) {
    for (let e of country.borders) {
      let found = await findCountry(e);
      let btn = document.createElement("button");
      btn.classList.add("btn");
      if (switcher) btn.classList.add("btnDark"); /*style */
      btn.textContent = found.name.common;
      btn.setAttribute("cca3", found.cca3);
      btn.addEventListener("click", () => {
        detailCountry(btn.getAttribute("cca3"));
      });
      border.appendChild(btn);
    }
  }
  infoLeft.append(pnn, pp, pr, psr, pc);
  infoRigth.append(ptld, pcur, plang);
  information.append(infoLeft, infoRigth);
  infoContainer.append(h2, information, border);
  const decorator = document.createElement("div");
  decorator.classList.add("decorator");
  decorator.append(img, infoContainer);
  content.appendChild(decorator);
};

const createInfoCountry = (name, popul, cap, reg, flag) => {
  const pop = popul.toLocaleString("en-US");

  const link = document.createElement("div");
  link.classList.add("link-info");
  link.style.animation = "show 3s forwards";
  link.addEventListener("click", () =>
    detailCountry(link.getAttribute("data-value"))
  );

  const country_container = document.createElement("div");
  country_container.classList.add("country-container");
  const flagImg = document.createElement("img");
  flagImg.src = flag;
  flagImg.alt = `Flag of ${name}`;
  const infoContainer = document.createElement("div");
  infoContainer.classList.add("info-container");
  const nameCountry = document.createElement("h4");
  nameCountry.textContent = name;
  const pPopul = document.createElement("p");
  pPopul.textContent = "Population: ";
  const pReg = document.createElement("p");
  pReg.textContent = "Region: ";
  const pCap = document.createElement("p");
  pCap.textContent = "Capital: ";
  const sPopul = document.createElement("span");
  sPopul.classList.add("population");
  sPopul.textContent = pop;
  const sReg = document.createElement("span");
  sReg.classList.add("region");
  sReg.textContent = reg;
  const sCap = document.createElement("span");
  sCap.classList.add("capital");
  sCap.textContent = cap;
  /*___________Add Style_______________ */
  const elements = [pCap, pPopul, pReg, nameCountry];
  if (switcher) {
    link.style.backgroundColor = "hsl(209, 23%, 22%)";
    for (const p of elements) {
      p.style.color = "#fff";
    }
  }
  /*________________________________________ */
  pPopul.appendChild(sPopul);
  pReg.appendChild(sReg);
  pCap.appendChild(sCap);

  infoContainer.appendChild(nameCountry);
  infoContainer.appendChild(pPopul);
  infoContainer.appendChild(pReg);
  infoContainer.appendChild(pCap);

  country_container.appendChild(flagImg);
  country_container.appendChild(infoContainer);

  link.appendChild(country_container);

  return link;
};

const createNavContent = () => {
  nav.removeChild(nav.lastChild);

  const form = document.createElement("form");
  form.classList.add("search__form");
  form.role = "search";
  form.name = "search&filter";

  const search = document.createElement("input");
  search.classList.add("form-control", "me-2");
  search.id = "form__control";
  search.type = "search";
  search.placeholder = "Search for a country...";
  search.ariaLabel = "Search";
  search.addEventListener("input", () => searchEvent(search, select));

  const select = document.createElement("select");
  select.id = "form__select";
  select.classList.add("form-select");
  select.ariaLabel = "Default select example";

  const defaultOption = document.createElement("option");
  defaultOption.disabled = true;
  defaultOption.selected = true;
  defaultOption.value = "";
  defaultOption.textContent = "Filter by region";
  if (switcher) {
    defaultOption.style.backgroundColor = "#202c37";
    defaultOption.style.color = "#fff";
    search.classList.add("btnDark");
    select.classList.add("btnDark");
  }
  defaultOption.style.display = "none";

  select.appendChild(defaultOption);
  select.addEventListener("change", () => selectEvent(select, search));

  for (const r of regions) {
    const option = document.createElement("option");
    if (switcher) {
      option.style.backgroundColor = "#202c37";
      option.style.color = "#fff";
    }
    option.value = r;
    option.textContent = r;
    select.appendChild(option);
  }
  form.append(search, select);
  nav.appendChild(form);
};

const giveInfo = async () => {
  const request = await fetch("https://restcountries.com/v3.1/all");
  const result = await request.json();
  return result;
};
const loadMoreCountries = (entries, asyncFunction) => {
  if (entries[entries.length - 1].isIntersecting) {
    showAllCountries(10, asyncFunction);
  }
};

const showAllCountries = async (num, asyncFunction) => {
  const countries = await asyncFunction();
  if (countries) {
    const fragment = document.createDocumentFragment();
    for (let c = 0; c < num; c++) {
      if (countries[count] != undefined) {
        const newCountry = createInfoCountry(
          countries[count].name.common,
          countries[count].population,
          countries[count].capital,
          countries[count].region,
          countries[count].flags.png
        );
        newCountry.setAttribute("data-value", countries[count].cca3);
        fragment.appendChild(newCountry);
        count++;
        if (c == num - 1) {
          if (observer) observer.disconnect();
          observer = new IntersectionObserver((entries) => {
            loadMoreCountries(entries, asyncFunction);
          });
          observer.observe(newCountry);
        }
      }
    }
    content.appendChild(fragment);
  }
};
const filterCountries = async (region) => {
  const countries = await giveInfo();
  const filteredCountries = countries.filter((countrie) => {
    return countrie.region === region;
  });
  return filteredCountries;
};
const findCountry = async (cca3) => {
  const countries = await giveInfo();
  const countryFound = countries.find((nation) => {
    return nation.cca3 === cca3;
  });
  return countryFound;
};

const findCountryByName = async (char) => {
  const firstLet = char[0];
  const firstLetUpper = firstLet.toUpperCase();
  const newChar = `${firstLetUpper}${char.slice(1)}`;
  const countries = await giveInfo();
  const foundCountry = countries.filter((country) => {
    if (country.name.common.includes(newChar)) return country;
  });
  return foundCountry;
};
/*___________Adding events___________________ */
const selectEvent = (select, search) => {
  eve = "select";
  while (content.children.length > 0) content.removeChild(content.lastChild);
  showAllCountries(8, filterCountries.bind(null, select.value));
  search.value = null;
  count = 0;
};

const searchEvent = async (search, select) => {
  eve = "input";
  if (search.value != "") {
    const countries = await findCountryByName(search.value);
    showAllCountries(
      countries.length,
      findCountryByName.bind(null, search.value)
    );
  } else if (search.value == "") showAllCountries(10, giveInfo);
  while (content.children.length > 0) content.removeChild(content.lastChild);
  select.value = "";
  count = 0;
};

select.addEventListener("change", () => selectEvent(select, search));
search.addEventListener("input", () => searchEvent(search, select));

btnDarkMode.addEventListener("click", () => {
  while (content.children.length > 0) content.removeChild(content.lastChild);
  if (document.getElementById("form__select") != null) {
    document.getElementById("form__select").classList.toggle("btnDark");
    document.getElementById("form__control").classList.toggle("btnDark");
  }
  if (!switcher) {
    switcher = true;
    document.body.style.backgroundColor = "#202c37";
    title.style.color = "#fff";
    header.style.backgroundColor = "hsl(209, 23%, 22%)";
    nav.style.backgroundColor = "#202c37";
    btnDarkMode.style.color = "#fff";
    ionHeader.name = "moon-sharp";
    ionHeader.style.color = "#fff";
    for (const o of document.querySelectorAll("option")) {
      o.style.backgroundColor = "#202c37";
      o.style.color = "#fff";
    }
  } else {
    switcher = false;
    document.body.style.backgroundColor = "";
    title.style.color = "";
    header.style.backgroundColor = "";
    nav.style.backgroundColor = "";
    btnDarkMode.style.color = "";
    ionHeader.name = "moon-outline";
    ionHeader.style.color = "#000";
    for (const o of document.querySelectorAll("option")) {
      o.style.backgroundColor = "";
      o.style.color = "";
    }
  }
  if (eve === "select")
    selectEvent(
      document.querySelector(".form-select"),
      document.querySelector(".form-control")
    );
  else if (eve === "input")
    searchEvent(
      document.querySelector(".form-control"),
      document.querySelector(".form-select")
    );
  else if (eve === "detail") {
    detailCountry(param[param.length - 1]);
    param.pop();
  } else if (eve === "back") showAllCountries(10, giveInfo);
  else showAllCountries(10, giveInfo);
  count = 0;
});
/*_____________________________________________ */

showAllCountries(12, giveInfo);

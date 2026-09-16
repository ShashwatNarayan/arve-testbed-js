"use strict";

const form = document.getElementById("search");
const status = document.getElementById("status");
const results = document.getElementById("results");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const q = document.getElementById("q").value;
  const resp = await fetch("/docs/search?q=" + encodeURIComponent(q));
  const rows = await resp.json();
  // TESTBED SAFE-03
  status.textContent = rows.length + " result(s)";
  // TESTBED SAST-04
  results.innerHTML = rows.map((row) => "<li>" + row.title + "</li>").join("");
});

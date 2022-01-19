'use strict';

const baseUrl = `https://mate-academy.github.io/`
+ `phone-catalogue-static/api/phones`;

function request(url) {
  return fetch(url)
    .then(responce => responce.json());
}

const phonesIdListArray
  = request(`${baseUrl}.json`)
    .then(result => result)
    .then(arrayPhonesResult => {
      return arrayPhonesResult.map(phone => {
        return request(`${baseUrl}/${phone.id}.json`);
      });
    });

function getFirstReceivedDetails(arrayPhonesId) {
  return arrayPhonesId
    .then(AllDetailsResult => Promise.race(AllDetailsResult));
}

function getAllSuccessfulDetails(arrayPhonesId) {
  return arrayPhonesId
    .then(AllDetailsResult => {
      return Promise.allSettled(AllDetailsResult)
        .then(results => results.filter(result => {
          return result.status === 'fulfilled';
        }));
    });
}

function getThreeFastestDetails(arrayPhonesId) {
  return getAllSuccessfulDetails(arrayPhonesId)
    .then(allSuccessfulDetails => allSuccessfulDetails.slice(0, 3));
}

function notifyUsers(element, className, textString) {
  const div = document.createElement('div');
  const h3 = document.createElement('h3');
  const ul = document.createElement('ul');

  if (Array.isArray(element)) {
    ul.innerHTML = `${element.map(item => {
      return `<li>${item.value.id}</li>`;
    })}`;
  } else {
    ul.innerHTML = `<li>${element.id}</li>`;
  }

  div.classList.add = className;
  h3.innerText = textString;

  div.append(h3);
  div.append(ul);

  document.body.append(div);
}

getFirstReceivedDetails(phonesIdListArray)
  .then(firstReceivedDetails => {
    return notifyUsers(
      firstReceivedDetails, `first-received`, `First Received`
    );
  });

getAllSuccessfulDetails(phonesIdListArray)
  .then(allReceivedDetails => {
    return notifyUsers(
      allReceivedDetails, `all-successful`, `All Successful`
    );
  });

getThreeFastestDetails(phonesIdListArray)
  .then(threeFastestDetails => {
    return notifyUsers(
      threeFastestDetails, `all-successful`, `Three Successful`
    );
  });

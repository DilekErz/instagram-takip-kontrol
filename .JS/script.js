const followersInput = document.getElementById("followersFile");
const followingInput = document.getElementById("followingFile");
const compareBtn = document.getElementById("compareBtn");
const countText = document.getElementById("countText");
const resultList = document.getElementById("resultList");

function readJsonFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function(event) {
      try {
        const data = JSON.parse(event.target.result);
        resolve(data);
      } catch (error) {
        reject("JSON dosyası okunamadı.");
      }
    };

    reader.onerror = function() {
      reject("Dosya okunurken hata oluştu.");
    };

    reader.readAsText(file);
  });
}

function getFollowers(data) {
  return data.map(item =>
    item.string_list_data[0].value.toLowerCase()
  );
}

function getFollowing(data) {
  return data.relationships_following.map(item =>
    item.string_list_data[0].value.toLowerCase()
  );
}

compareBtn.addEventListener("click", async function() {
  const followersFile = followersInput.files[0];
  const followingFile = followingInput.files[0];

  if (!followersFile || !followingFile) {
    alert("Lütfen iki JSON dosyasını da yükle.");
    return;
  }

  try {
    const followersData = await readJsonFile(followersFile);
    const followingData = await readJsonFile(followingFile);

    const followers = getFollowers(followersData);
    const following = getFollowing(followingData);

    const takipEtmeyenler = following.filter(user =>
      !followers.includes(user)
    );

    resultList.innerHTML = "";

    countText.textContent = `${takipEtmeyenler.length} kişi seni takip etmiyor.`;

    takipEtmeyenler.forEach(user => {
      const li = document.createElement("li");
      li.textContent = user;
      resultList.appendChild(li);
    });

  } catch (error) {
    alert(error);
  }
});
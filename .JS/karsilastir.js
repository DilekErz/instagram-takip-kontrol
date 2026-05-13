const fs = require("fs");

// JSON dosyasını oku
const followersData = JSON.parse(
  fs.readFileSync("followers_1.json", "utf-8")
);

const followingData = JSON.parse(
  fs.readFileSync("following.json", "utf-8")
);

// Takipçileri al
const followers = followersData.map(
  item => item.string_list_data[0].value.toLowerCase()
);

// Takip ettiklerini al
const following = followingData.relationships_following.map(
  item => item.string_list_data[0].value.toLowerCase()
);

// Seni takip etmeyenleri bul
const takipEtmeyenler = following.filter(
  user => !followers.includes(user)
);

console.log("Seni takip etmeyenler:");
console.log("----------------------");

takipEtmeyenler.forEach(user => {
  console.log(user);
});
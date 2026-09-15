// Real Ethiopian health facilities — major hospitals, health centers, and clinics
// Organized by region for relevance
export const healthFacilities = [
  // Addis Ababa
  { id: 1, name: "Black Lion Hospital (Tikur Anbessa)", nameAm: "ጥቁር አንበሳ ሆስፒታል", nameOm: "Hospitaala Tikur Anbessa", type: "hospital", lat: 9.0227, lng: 38.7468, region: "Addis Ababa", phone: "+251111239625" },
  { id: 2, name: "St. Paul's Hospital Millennium Medical College", nameAm: "ቅዱስ ጳውሎስ ሆስፒታል", nameOm: "Hospitaala St. Paul's", type: "hospital", lat: 9.0338, lng: 38.7482, region: "Addis Ababa", phone: "+251111275327" },
  { id: 3, name: "Yekatit 12 Hospital", nameAm: "የካቲት 12 ሆስፒታል", nameOm: "Hospitaala Yekatit 12", type: "hospital", lat: 9.0333, lng: 38.7500, region: "Addis Ababa", phone: "+251111115697" },
  { id: 4, name: "Gandhi Memorial Hospital", nameAm: "ጋንዲ ሆስፒታል", nameOm: "Hospitaala Gandhi", type: "hospital", lat: 9.0189, lng: 38.7469, region: "Addis Ababa", phone: "+251111553400" },
  { id: 5, name: "ALERT Hospital", nameAm: "አለርት ሆስፒታል", nameOm: "Hospitaala ALERT", type: "hospital", lat: 9.0122, lng: 38.7336, region: "Addis Ababa", phone: "+251114665510" },
  { id: 6, name: "Zewditu Memorial Hospital", nameAm: "ዘውዲቱ ሆስፒታል", nameOm: "Hospitaala Zewditu", type: "hospital", lat: 9.0214, lng: 38.7611, region: "Addis Ababa" },
  { id: 7, name: "Addis Ababa Health Center (Bole)", nameAm: "ቦሌ ጤና ጣቢያ", nameOm: "Buufata Fayyaa Bole", type: "health_center", lat: 8.9944, lng: 38.8043, region: "Addis Ababa" },
  { id: 8, name: "Kotebe Health Center", nameAm: "ቆጠቤ ጤና ጣቢያ", nameOm: "Buufata Fayyaa Kotebe", type: "health_center", lat: 9.0522, lng: 38.8083, region: "Addis Ababa" },
  { id: 9, name: "Lideta Health Center", nameAm: "ልደታ ጤና ጣቢያ", nameOm: "Buufata Fayyaa Lideta", type: "health_center", lat: 9.0100, lng: 38.7350, region: "Addis Ababa" },
  { id: 10, name: "Arada Health Center", nameAm: "አራዳ ጤና ጣቢያ", nameOm: "Buufata Fayyaa Arada", type: "health_center", lat: 9.0353, lng: 38.7444, region: "Addis Ababa" },

  // Oromia Region
  { id: 11, name: "Jimma University Medical Center", nameAm: "ጅማ ዩኒቨርሲቲ ህክምና ማዕከል", nameOm: "Hospitaala Yuniversitii Jimmaa", type: "hospital", lat: 7.6833, lng: 36.8167, region: "Oromia" },
  { id: 12, name: "Adama Hospital Medical College", nameAm: "አዳማ ሆስፒታል", nameOm: "Hospitaala Adaamaa", type: "hospital", lat: 8.5500, lng: 39.2667, region: "Oromia" },
  { id: 13, name: "Nekemte Referral Hospital", nameAm: "ነቀምቴ ሪፈራል ሆስፒታል", nameOm: "Hospitaala Referaalaa Naqamtee", type: "hospital", lat: 9.0833, lng: 36.5333, region: "Oromia" },
  { id: 14, name: "Ambo Hospital", nameAm: "አምቦ ሆስፒታል", nameOm: "Hospitaala Amboo", type: "hospital", lat: 8.9833, lng: 37.8500, region: "Oromia" },
  { id: 15, name: "Shashamane General Hospital", nameAm: "ሻሸመኔ ሆስፒታል", nameOm: "Hospitaala Shaashamannee", type: "hospital", lat: 7.2000, lng: 38.6000, region: "Oromia" },
  { id: 16, name: "Bishoftu General Hospital", nameAm: "ቢሾፍቱ ሆስፒታል", nameOm: "Hospitaala Bishooftuu", type: "hospital", lat: 8.7500, lng: 38.9833, region: "Oromia" },
  { id: 17, name: "Batu Health Center", nameAm: "ባቱ ጤና ጣቢያ", nameOm: "Buufata Fayyaa Baatuu", type: "health_center", lat: 7.8667, lng: 38.7167, region: "Oromia" },
  { id: 18, name: "Holeta Health Center", nameAm: "ሆለታ ጤና ጣቢያ", nameOm: "Buufata Fayyaa Holeetaa", type: "health_center", lat: 9.0667, lng: 38.5000, region: "Oromia" },

  // Amhara Region
  { id: 19, name: "Felege Hiwot Referral Hospital (Bahir Dar)", nameAm: "ፈለገ ህይወት ሪፈራል ሆስፒታል", nameOm: "Hospitaala Referaalaa Baahir Dar", type: "hospital", lat: 11.5931, lng: 37.3869, region: "Amhara" },
  { id: 20, name: "University of Gondar Hospital", nameAm: "የጎንደር ዩኒቨርሲቲ ሆስፒታል", nameOm: "Hospitaala Yuniversitii Gondar", type: "hospital", lat: 12.6000, lng: 37.4667, region: "Amhara" },
  { id: 21, name: "Debre Markos Referral Hospital", nameAm: "ደብረ ማርቆስ ሪፈራል ሆስፒታል", nameOm: "Hospitaala Referaalaa Debre Markos", type: "hospital", lat: 10.3500, lng: 37.7167, region: "Amhara" },
  { id: 22, name: "Dessie Referral Hospital", nameAm: "ደሴ ሪፈራል ሆስፒታል", nameOm: "Hospitaala Referaalaa Dessie", type: "hospital", lat: 11.1333, lng: 39.6333, region: "Amhara" },
  { id: 23, name: "Bahir Dar Health Center", nameAm: "ባህር ዳር ጤና ጣቢያ", nameOm: "Buufata Fayyaa Baahir Dar", type: "health_center", lat: 11.5950, lng: 37.3950, region: "Amhara" },

  // SNNPR / Sidama
  { id: 24, name: "Hawassa University Comprehensive Specialized Hospital", nameAm: "ሀዋሳ ዩኒቨርሲቲ ሆስፒታል", nameOm: "Hospitaala Yuniversitii Hawwasaa", type: "hospital", lat: 7.0500, lng: 38.4667, region: "Sidama/SNNPR" },
  { id: 25, name: "Yirgalem General Hospital", nameAm: "ይርጋለም ሆስፒታል", nameOm: "Hospitaala Yirgalem", type: "hospital", lat: 6.7500, lng: 38.4000, region: "Sidama/SNNPR" },
  { id: 26, name: "Arba Minch General Hospital", nameAm: "አርባ ምንጭ ሆስፒታል", nameOm: "Hospitaala Arba Minch", type: "hospital", lat: 6.0333, lng: 37.5500, region: "Sidama/SNNPR" },
  { id: 27, name: "Wolaita Sodo University Referral Hospital", nameAm: "ወላይታ ሶዶ ዩኒቨርሲቲ ሪፈራል ሆስፒታል", nameOm: "Hospitaala Referaalaa Wolayita Sodo", type: "hospital", lat: 6.8500, lng: 37.7500, region: "Sidama/SNNPR" },

  // Tigray Region
  { id: 28, name: "Ayder Comprehensive Specialized Hospital (Mekelle)", nameAm: "አይደር ሆስፒታል (መቀሌ)", nameOm: "Hospitaala Ayder (Mekelle)", type: "hospital", lat: 13.4833, lng: 39.4667, region: "Tigray" },
  { id: 29, name: "Axum General Hospital", nameAm: "አክሱም ሆስፒታል", nameOm: "Hospitaala Axum", type: "hospital", lat: 14.1208, lng: 38.7247, region: "Tigray" },

  // Somali Region
  { id: 30, name: "Jigjiga Health Center", nameAm: "ጅጅጋ ጤና ጣቢያ", nameOm: "Buufata Fayyaa Jigjiga", type: "health_center", lat: 9.3500, lng: 42.8000, region: "Somali" },
  { id: 31, name: "Karamara General Hospital", nameAm: "ካራማራ ሆስፒታል", nameOm: "Hospitaala Karamara", type: "hospital", lat: 9.3333, lng: 42.8167, region: "Somali" },

  // Afar Region
  { id: 32, name: "Dubti Referral Hospital", nameAm: "ዱብቲ ሪፈራል ሆስፒታል", nameOm: "Hospitaala Referaalaa Dubti", type: "hospital", lat: 11.7333, lng: 41.0833, region: "Afar" },

  // Dire Dawa
  { id: 33, name: "Dilchora Referral Hospital (Dire Dawa)", nameAm: "ድልቾራ ሪፈራል ሆስፒታል", nameOm: "Hospitaala Referaalaa Dilchora", type: "hospital", lat: 9.5833, lng: 41.8667, region: "Dire Dawa" },

  // Benishangul-Gumuz
  { id: 34, name: "Assosa General Hospital", nameAm: "አሶሳ ሆስፒታል", nameOm: "Hospitaala Assosa", type: "hospital", lat: 10.0667, lng: 34.5333, region: "Benishangul-Gumuz" },

  // Gambella
  { id: 35, name: "Gambella General Hospital", nameAm: "ጋምቤላ ሆስፒታል", nameOm: "Hospitaala Gambella", type: "hospital", lat: 8.2500, lng: 34.5833, region: "Gambella" },

  // Harari
  { id: 36, name: "Hiwot Fana Comprehensive Specialized Hospital (Harar)", nameAm: "ህይወት ፋና ሆስፒታል (ሐረር)", nameOm: "Hospitaala Hiwot Fana (Harar)", type: "hospital", lat: 9.3147, lng: 42.1175, region: "Harari" },
];

export function getLocalizedName(facility, lang) {
  if (lang === 'am' && facility.nameAm) return facility.nameAm;
  if (lang === 'om' && facility.nameOm) return facility.nameOm;
  return facility.name;
}

export function getTypeLabel(type, lang) {
  const labels = {
    hospital: { en: 'Hospital', am: 'ሆስፒታል', om: 'Hospitaala' },
    health_center: { en: 'Health Center', am: 'ጤና ጣቢያ', om: 'Buufata Fayyaa' },
    clinic: { en: 'Clinic', am: 'ክሊኒክ', om: 'Kilinika' },
  };
  return (labels[type] || labels.health_center)[lang] || labels[type]?.en || type;
}

// Haversine distance in km
export function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getNearestFacilities(userLat, userLng, count = 5) {
  return healthFacilities
    .map(f => ({ ...f, distance: getDistance(userLat, userLng, f.lat, f.lng) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, count);
}

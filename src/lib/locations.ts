/**
 * State → City → Area → Sub-area hierarchy used by the discovery filters.
 * Plain geography only (no business data). Extend by adding entries.
 */
export type LocationTree = Record<string, Record<string, Record<string, string[]>>>;

export const LOCATIONS: LocationTree = {
  Maharashtra: {
    Mumbai: {
      Colaba: ["Cuffe Parade", "Navy Nagar", "Apollo Bunder", "Sassoon Dock"],
      Fort: ["Kala Ghoda", "Ballard Estate", "Flora Fountain", "CST"],
      Churchgate: ["Marine Drive", "Nariman Point", "Oval Maidan"],
      Girgaon: ["Chowpatty", "Charni Road", "Thakurdwar"],
      "Malabar Hill": ["Walkeshwar", "Napean Sea Road", "Kemps Corner"],
      Tardeo: ["Haji Ali", "Breach Candy", "Peddar Road"],
      Byculla: ["Agripada", "Nagpada", "Madanpura"],
      "Lower Parel": ["Kamala Mills", "Phoenix Mills", "Delisle Road"],
      Worli: ["Worli Sea Face", "Worli Naka", "Prabhadevi"],
      Dadar: ["Dadar East", "Dadar West", "Shivaji Park", "Hindmata"],
      Matunga: ["King's Circle", "Matunga East", "Matunga West"],
      Mahim: ["Mahim Causeway", "Shitladevi"],
      Sion: ["Sion East", "Sion West", "Pratiksha Nagar"],
      Wadala: ["Wadala East", "Wadala West", "Antop Hill"],
      Bandra: ["Bandra West", "Bandra East", "Pali Hill", "Hill Road", "Carter Road", "Bandstand", "BKC"],
      Khar: ["Khar West", "Khar East", "Linking Road"],
      Santacruz: ["Santacruz West", "Santacruz East", "Kalina", "Vakola"],
      "Vile Parle": ["Vile Parle East", "Vile Parle West", "Juhu Scheme"],
      Juhu: ["Juhu Beach", "JVPD", "Juhu Tara Road"],
      "Andheri East": ["MIDC", "Chakala", "Marol", "Saki Naka", "JB Nagar", "Sahar"],
      "Andheri West": ["Lokhandwala", "Versova", "Four Bungalows", "Seven Bungalows", "DN Nagar", "Oshiwara"],
      Jogeshwari: ["Jogeshwari East", "Jogeshwari West"],
      "Goregaon East": ["Aarey Colony", "Film City", "NESCO", "Gokuldham"],
      "Goregaon West": ["Bangur Nagar", "Jawahar Nagar", "Motilal Nagar"],
      "Malad East": ["Kurar Village", "Dindoshi", "Pathanwadi", "Rani Sati Marg"],
      "Malad West": ["Mith Chowky", "Marve Road", "Evershine Nagar", "Orlem", "Malvani", "Inorbit"],
      "Kandivali East": ["Thakur Village", "Thakur Complex", "Lokhandwala Township", "Hanuman Nagar", "Samta Nagar", "Ashok Nagar"],
      "Kandivali West": ["Mahavir Nagar", "Charkop", "Irani Wadi", "Poisar", "Dahanukar Wadi"],
      "Borivali East": ["Magathane", "Devipada", "Rajendra Nagar", "National Park"],
      "Borivali West": ["IC Colony", "Gorai", "Shimpoli", "Chikuwadi", "Babhai"],
      Dahisar: ["Dahisar East", "Dahisar West", "Rawalpada"],
      Kurla: ["Kurla East", "Kurla West", "Nehru Nagar"],
      Chembur: ["Chembur East", "Chembur West", "Diamond Garden", "Tilak Nagar"],
      Ghatkopar: ["Ghatkopar East", "Ghatkopar West", "Pant Nagar", "Rajawadi"],
      Vikhroli: ["Vikhroli East", "Vikhroli West", "Kannamwar Nagar"],
      Powai: ["Hiranandani Gardens", "IIT Powai", "Chandivali", "Raheja Vihar"],
      Bhandup: ["Bhandup East", "Bhandup West"],
      Mulund: ["Mulund East", "Mulund West", "Vaishali Nagar"],
    },
    Thane: {
      "Thane West": ["Ghodbunder Road", "Hiranandani Estate", "Vasant Vihar", "Majiwada", "Naupada", "Pokhran Road"],
      "Thane East": ["Kopri", "Chendani"],
      Kalwa: ["Kharegaon", "Vitawa"],
      Mumbra: ["Kausa", "Shil Phata"],
    },
    "Navi Mumbai": {
      Vashi: ["Sector 17", "Palm Beach Road", "Juhu Nagar"],
      Nerul: ["Nerul East", "Nerul West", "Seawoods"],
      Belapur: ["CBD Belapur", "Kharghar Road"],
      Kharghar: ["Sector 7", "Sector 20", "Central Park"],
      Airoli: ["Sector 5", "Sector 15"],
      "Ghansoli": ["Sector 3", "Sector 7"],
      Panvel: ["New Panvel", "Old Panvel", "Kamothe", "Kalamboli"],
    },
    "Mira-Bhayandar": {
      "Mira Road": ["Mira Road East", "Shanti Nagar", "Beverly Park"],
      Bhayandar: ["Bhayandar East", "Bhayandar West"],
    },
    "Vasai-Virar": {
      Vasai: ["Vasai East", "Vasai West"],
      Nalasopara: ["Nalasopara East", "Nalasopara West"],
      Virar: ["Virar East", "Virar West"],
    },
    "Kalyan-Dombivli": {
      Kalyan: ["Kalyan East", "Kalyan West"],
      Dombivli: ["Dombivli East", "Dombivli West", "Palava"],
    },
    Pune: {
      Kothrud: ["Karve Nagar", "Paud Road", "Erandwane"],
      Shivajinagar: ["FC Road", "JM Road", "Model Colony", "Deccan"],
      "Koregaon Park": ["North Main Road", "Lane 5", "Kalyani Nagar"],
      "Viman Nagar": ["Phoenix Marketcity", "Datta Mandir Chowk"],
      Baner: ["Baner Road", "Balewadi", "Pashan"],
      Aundh: ["ITI Road", "DP Road"],
      Hinjewadi: ["Phase 1", "Phase 2", "Phase 3", "Wakad"],
      Kharadi: ["EON IT Park", "Chandan Nagar"],
      Hadapsar: ["Magarpatta", "Amanora", "Fursungi"],
      Camp: ["MG Road", "East Street"],
      "Pimpri-Chinchwad": ["Pimpri", "Chinchwad", "Nigdi", "Akurdi", "Pimple Saudagar"],
    },
    Nagpur: {
      Dharampeth: ["Shankar Nagar", "Ramdaspeth", "Bajaj Nagar"],
      Sitabuldi: ["Variety Square", "Jhansi Rani Square"],
      Sadar: ["Civil Lines", "Gittikhadan"],
      "Manish Nagar": ["Somalwada", "Besa"],
    },
    Nashik: {
      "College Road": ["Gangapur Road", "Canada Corner"],
      "Nashik Road": ["Bytco Point", "Jail Road"],
      Panchavati: ["Ram Kund", "Tapovan"],
      Cidco: ["Uttam Nagar", "Pathardi Phata"],
    },
    "Chhatrapati Sambhajinagar": {
      Cidco: ["N-1", "N-5", "N-7"],
      "Nirala Bazar": ["Samarth Nagar", "Osmanpura"],
      "Jalna Road": ["Kranti Chowk", "Seven Hills"],
    },
    Kolhapur: {
      "Rajarampuri": ["Main Road", "Shahupuri"],
      "Tarabai Park": ["Kawala Naka", "Nagala Park"],
    },
    Solapur: {
      "Saat Rasta": ["Railway Lines", "Murarji Peth"],
      "Hotgi Road": ["Vijapur Road", "Jule Solapur"],
    },
    Amravati: { Rajapeth: ["Rajkamal Chowk"], Camp: ["Badnera Road"] },
    Lonavala: { Lonavala: ["Tungarli", "Bhushi Dam", "Khandala"] },
    Alibag: { Alibag: ["Nagaon", "Kihim", "Varsoli"] },
  },
  "Andhra Pradesh": {
    Visakhapatnam: { "Beach Road": ["Rushikonda", "RK Beach"], Dwarakanagar: ["MVP Colony", "Seethammadhara"] },
    Vijayawada: { "Benz Circle": ["Governorpet", "Labbipet"], Patamata: ["Auto Nagar"] },
    Guntur: { "Brodipet": ["Arundelpet", "Pattabhipuram"] },
    Tirupati: { "Tirumala Road": ["Renigunta", "Alipiri"] },
  },
  "Arunachal Pradesh": {
    Itanagar: { "Naharlagun": ["Papu Nallah", "Ganga Market"] },
  },
  Assam: {
    Guwahati: { "GS Road": ["Christian Basti", "Ulubari"], Fancy: ["Pan Bazaar", "Paltan Bazaar"] },
    Dibrugarh: { "Khaliamari": ["New Market"] },
    Silchar: { "Rangirkhari": ["Park Road"] },
  },
  Bihar: {
    Patna: { "Boring Road": ["Rajendra Nagar", "Kankarbagh"], "Gandhi Maidan": ["Ashok Rajpath"] },
    Gaya: { "Bodh Gaya Road": ["Swarajpuri"] },
    Muzaffarpur: { "Mithanpura": ["Company Bagh"] },
  },
  Chhattisgarh: {
    Raipur: { "Shankar Nagar": ["Pandri", "Civil Lines"], "MG Road": ["Gol Bazaar"] },
    Bhilai: { "Sector 6": ["Civic Centre"] },
  },
  Goa: {
    "North Goa": { Panaji: ["Miramar", "Fontainhas"], Calangute: ["Baga", "Candolim"], Mapusa: ["Anjuna", "Vagator"] },
    "South Goa": { Margao: ["Colva", "Benaulim"], "Vasco da Gama": ["Bogmalo"] },
  },
  Gujarat: {
    Ahmedabad: { "CG Road": ["Navrangpura", "Ellis Bridge"], Maninagar: ["Kankaria"], "Satellite": ["Bodakdev", "Vastrapur"] },
    Surat: { "Adajan": ["Vesu", "Athwa"], "Ghod Dod Road": ["Piplod"] },
    Vadodara: { "Alkapuri": ["Fatehgunj", "Sayajigunj"] },
    Rajkot: { "Race Course": ["Kalawad Road", "University Road"] },
  },
  Haryana: {
    Gurugram: { "Sector 29": ["DLF Phase 1", "Cyber City"], "Sohna Road": ["Sector 48", "Sector 50"] },
    Faridabad: { "Sector 15": ["NIT", "Sector 21"] },
    Panipat: { "Model Town": ["GT Road"] },
  },
  "Himachal Pradesh": {
    Shimla: { "Mall Road": ["Ridge", "Lakkar Bazaar"] },
    Manali: { "Old Manali": ["Mall Road", "Vashisht"] },
    Dharamshala: { "McLeod Ganj": ["Bhagsu"] },
  },
  Jharkhand: {
    Ranchi: { "Main Road": ["Lalpur", "Harmu"] },
    Jamshedpur: { "Bistupur": ["Sakchi", "Kadma"] },
    Dhanbad: { "Bank More": ["Hirapur"] },
  },
  Karnataka: {
    Bengaluru: { Koramangala: ["HSR Layout", "BTM Layout"], Indiranagar: ["100 Feet Road", "Domlur"], Whitefield: ["ITPL", "Marathahalli"], "MG Road": ["Brigade Road", "Church Street"], Jayanagar: ["JP Nagar", "Basavanagudi"], "Electronic City": ["Phase 1", "Phase 2"] },
    Mysuru: { "Devaraja Mohalla": ["Kuvempunagar", "Vijayanagar"] },
    Mangaluru: { "Hampankatta": ["Balmatta", "Kadri"] },
    Hubballi: { "Keshwapur": ["Vidyanagar"] },
  },
  Kerala: {
    Kochi: { "Marine Drive": ["MG Road", "Broadway"], "Fort Kochi": ["Mattancherry"], Edappally: ["Lulu Mall"] },
    Thiruvananthapuram: { "Kowdiar": ["Pattom", "Vazhuthacaud"] },
    Kozhikode: { "Mavoor Road": ["Palayam", "Beach Road"] },
    Thrissur: { "Round": ["Swaraj Round", "MG Road"] },
  },
  "Madhya Pradesh": {
    Indore: { "Vijay Nagar": ["Scheme 54", "Palasia"], "MG Road": ["Sarafa Bazaar"] },
    Bhopal: { "MP Nagar": ["New Market", "Arera Colony"] },
    Gwalior: { "City Centre": ["Lashkar", "Thatipur"] },
    Jabalpur: { "Napier Town": ["Wright Town"] },
  },
  Manipur: {
    Imphal: { "Thangal Bazaar": ["Paona Bazaar"] },
  },
  Meghalaya: {
    Shillong: { "Police Bazaar": ["Laitumkhrah", "Nongthymmai"] },
  },
  Mizoram: {
    Aizawl: { "Zarkawt": ["Dawrpui"] },
  },
  Nagaland: {
    Kohima: { "PR Hill": ["Kohima Village"] },
    Dimapur: { "City Tower": ["Circular Road"] },
  },
  Odisha: {
    Bhubaneswar: { "Saheed Nagar": ["Jaydev Vihar", "Nayapalli"] },
    Cuttack: { "Buxi Bazaar": ["College Square"] },
    Puri: { "Grand Road": ["Sea Beach"] },
  },
  Punjab: {
    Ludhiana: { "Model Town": ["Sarabha Nagar", "Civil Lines"] },
    Amritsar: { "Ranjit Avenue": ["Lawrence Road", "Hall Bazaar"] },
    Jalandhar: { "Model Town": ["Nakodar Road"] },
    Chandigarh: { "Sector 17": ["Sector 22", "Sector 35"] },
  },
  Rajasthan: {
    Jaipur: { "C-Scheme": ["MI Road", "Bapu Bazaar"], "Malviya Nagar": ["Jagatpura", "Vaishali Nagar"] },
    Udaipur: { "Chetak Circle": ["Fatehpura", "Hiran Magri"] },
    Jodhpur: { "Sardarpura": ["Paota", "Ratanada"] },
    Kota: { "Talwandi": ["Vigyan Nagar"] },
  },
  Sikkim: {
    Gangtok: { "MG Marg": ["Deorali", "Tadong"] },
  },
  "Tamil Nadu": {
    Chennai: { "T Nagar": ["Pondy Bazaar", "Nungambakkam"], Adyar: ["Besant Nagar", "Thiruvanmiyur"], "Anna Nagar": ["Shanthi Colony", "Kilpauk"], Velachery: ["OMR", "Perungudi"] },
    Coimbatore: { "RS Puram": ["Gandhipuram", "Peelamedu"] },
    Madurai: { "Anna Nagar": ["KK Nagar", "Tallakulam"] },
    Tiruchirappalli: { "Thillai Nagar": ["Cantonment"] },
  },
  Telangana: {
    Hyderabad: { Banjara: ["Jubilee Hills", "Road No 12"], Hitech: ["Madhapur", "Gachibowli", "Kondapur"], Secunderabad: ["Begumpet", "Ameerpet"], "Banjara Hills": ["Masab Tank"] },
    Warangal: { "Hanamkonda": ["Kazipet"] },
  },
  Tripura: {
    Agartala: { "Post Office Chowmuhani": ["Krishnanagar"] },
  },
  "Uttar Pradesh": {
    Lucknow: { "Hazratganj": ["Gomti Nagar", "Aliganj"], "Indira Nagar": ["Sector 25"] },
    Kanpur: { "Swaroop Nagar": ["Kakadeo", "Civil Lines"] },
    Varanasi: { "Lanka": ["BHU", "Sigra"] },
    Noida: { "Sector 18": ["Sector 62", "Sector 137", "Greater Noida"] },
    Agra: { "Taj Ganj": ["Sanjay Place", "Kamla Nagar"] },
    Prayagraj: { "Civil Lines": ["George Town"] },
  },
  Uttarakhand: {
    Dehradun: { "Rajpur Road": ["Clock Tower", "Clement Town"] },
    Haridwar: { "Har Ki Pauri": ["Ranipur"] },
    Rishikesh: { "Tapovan": ["Laxman Jhula"] },
  },
  "West Bengal": {
    Kolkata: { "Park Street": ["Camac Street", "Elgin Road"], "Salt Lake": ["Sector V", "Bidhannagar"], Ballygunge: ["Gariahat", "Southern Avenue"], "New Town": ["Action Area 1", "Rajarhat"] },
    Howrah: { "Shibpur": ["Maidan"] },
    Siliguri: { "Hill Cart Road": ["Sevoke Road"] },
    Durgapur: { "City Centre": ["Benachity"] },
  },
  Delhi: {
    "New Delhi": { "Connaught Place": ["Janpath", "Barakhamba Road"], "Karol Bagh": ["Ajmal Khan Road"] },
    "South Delhi": { Hauz: ["Hauz Khas Village", "Green Park"], Saket: ["Malviya Nagar", "Lado Sarai"], "Greater Kailash": ["M Block", "N Block"] },
    "North Delhi": { "Model Town": ["Civil Lines", "Kamla Nagar"] },
    "West Delhi": { Rajouri: ["Rajouri Garden", "Tagore Garden"], Janakpuri: ["District Centre"] },
    "East Delhi": { "Preet Vihar": ["Laxmi Nagar", "Mayur Vihar"] },
  },
  "Jammu and Kashmir": {
    Srinagar: { "Lal Chowk": ["Residency Road", "Dal Lake"] },
    Jammu: { "Gandhi Nagar": ["Residency Road", "Trikuta Nagar"] },
  },
  Ladakh: {
    Leh: { "Main Bazaar": ["Changspa"] },
  },
  Puducherry: {
    Puducherry: { "White Town": ["Rock Beach", "Mission Street"], "MG Road": ["Lawspet"] },
  },
  "Andaman and Nicobar Islands": {
    "Port Blair": { "Aberdeen Bazaar": ["Marina Park"] },
  },
  Chandigarh: {
    Chandigarh: { "Sector 17": ["Sector 22", "Sector 35", "Sector 8"] },
  },
  "Dadra and Nagar Haveli and Daman and Diu": {
    Silvassa: { "Vapi Road": ["Tokarkhada"] },
    Daman: { "Nani Daman": ["Devka Beach"] },
  },
  Lakshadweep: {
    Kavaratti: { "Kavaratti": ["Ujra Mosque Road"] },
  },
};

export const STATES = Object.keys(LOCATIONS);
export const citiesOf = (state: string) => Object.keys(LOCATIONS[state] ?? {});
export const areasOf = (state: string, city: string) => Object.keys(LOCATIONS[state]?.[city] ?? {});
export const subAreasOf = (state: string, city: string, area: string) =>
  LOCATIONS[state]?.[city]?.[area] ?? [];

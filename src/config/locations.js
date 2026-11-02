/**
 * Location Data Configuration
 * Hierarchical master data for State -> District -> Local Government Type -> Administrative Body
 */

const LOCATION_DATA = {
  "West Bengal": {
    districts: {
      "Kolkata": {
        urban: [
          "Kolkata Municipal Corporation (KMC)"
        ],
        rural: []
      },
      "Howrah": {
        urban: [
          "Howrah Municipal Corporation (HMC)",
          "Bally Municipality",
          "Uluberia Municipality"
        ],
        rural: [
          "Amta-I Gram Panchayat",
          "Amta-II Gram Panchayat",
          "Bagnan-I Gram Panchayat",
          "Domjur Gram Panchayat",
          "Sankrail Gram Panchayat",
          "Udaynarayanpur Gram Panchayat"
        ]
      },
      "North 24 Parganas": {
        urban: [
          "Bidhannagar Municipal Corporation (BMC)",
          "Barasat Municipality",
          "Barrackpore Municipality",
          "Kamarhati Municipality",
          "Dum Dum Municipality",
          "South Dum Dum Municipality",
          "Panihati Municipality"
        ],
        rural: [
          "Amdanga Gram Panchayat",
          "Barasat-I Gram Panchayat",
          "Deganga Gram Panchayat",
          "Habra-I Gram Panchayat",
          "Rajarhat Gram Panchayat"
        ]
      },
      "South 24 Parganas": {
        urban: [
          "Rajpur Sonarpur Municipality",
          "Baruipur Municipality",
          "Budge Budge Municipality",
          "Maheshtala Municipality",
          "Diamond Harbour Municipality"
        ],
        rural: [
          "Baruipur Gram Panchayat",
          "Bhangar-I Gram Panchayat",
          "Bishnupur-I Gram Panchayat",
          "Canning-I Gram Panchayat",
          "Sonarpur Gram Panchayat"
        ]
      }
    }
  },
  "Maharashtra": {
    districts: {
      "Mumbai City": {
        urban: [
          "Brihanmumbai Municipal Corporation (BMC)"
        ],
        rural: []
      },
      "Pune": {
        urban: [
          "Pune Municipal Corporation (PMC)",
          "Pimpri Chinchwad Municipal Corporation (PCMC)"
        ],
        rural: [
          "Haveli Gram Panchayat",
          "Mulshi Gram Panchayat",
          "Baramati Gram Panchayat"
        ]
      }
    }
  },
  "Delhi": {
    districts: {
      "Central Delhi": {
        urban: [
          "Municipal Corporation of Delhi (MCD)",
          "New Delhi Municipal Council (NDMC)"
        ],
        rural: []
      },
      "South Delhi": {
        urban: [
          "Municipal Corporation of Delhi (MCD)"
        ],
        rural: []
      }
    }
  },
  "Karnataka": {
    districts: {
      "Bengaluru Urban": {
        urban: [
          "Bruhat Bengaluru Mahanagara Palike (BBMP)"
        ],
        rural: [
          "Anekal Gram Panchayat",
          "Yelahanka Gram Panchayat"
        ]
      }
    }
  }
};

module.exports = {
  LOCATION_DATA
};

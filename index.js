const express = require("express");
const app = express();
const { initialiseDatabase } = require("./db/db.connect");
const Hotel = require("./models/hotels.models");

app.use(express.json());

initialiseDatabase();

async function createHotel(newHotel) {
  try {
    const hotel = new Hotel(newHotel);
    const saveHotel = await hotel.save();
    return saveHotel;
  } catch (error) {
    throw error;
  }
}

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.post("/hotels", async (req, res) => {
  try {
    const savedHotel = await createHotel(req.body);
    res
      .status(201)
      .json({ message: "Hotel added successfully.", hotel: savedHotel });
  } catch (error) {
    res.status(500).json({ error: "Failed to add the hotel" });
  }
});

async function readAllHotels() {
  try {
    const allHotels = await Hotel.find();
    return allHotels;
  } catch (error) {
    console.log(error);
  }
}

app.get("/hotels", async (req, res) => {
  try {
    const hotels = await readAllHotels();
    if (hotels.length != 0) {
      res.json(hotels);
    } else {
      res.status(404).json({ error: "No Hotels Found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch the hotels." });
  }
});

async function getHotelByName(hotelName) {
  try {
    const hotel = await Hotel.find({ name: hotelName });
    return hotel;
  } catch (error) {
    throw error;
  }
}

app.get("/hotels/:hotelName", async (req, res) => {
  try {
    const hotels = await getHotelByName(req.params.hotelName);
    if (hotels.length != 0) {
      res.json(hotels);
    } else {
      res.status(404).json({ error: "No Hotels Found." });
    }
  } catch (error) {
    res.status(404).json({ error: "Failed to fetch the hotels." });
  }
});

async function hasParkingSpace() {
  try {
    const hotel = await Hotel.find({ isParkingAvailable: true });
    console.log(hotel);
  } catch (error) {
    console.log(error);
  }
}

async function hasRestaurantAvailable() {
  try {
    const hotel = await Hotel.find({ isRestaurantAvailable: true });
    console.log(hotel);
  } catch (error) {
    console.log(error);
  }
}

async function getHotelsByCategory(category) {
  try {
    const hotel = await Hotel.find({ category: category });
    return hotel;
  } catch (error) {
    console.log(error);
  }
}

app.get("/hotels/category/:hotelCategory", async (req, res) => {
  try {
    const hotels = await getHotelsByCategory(req.params.hotelCategory);
    if (hotels.length != 0) {
      res.json(hotels);
    } else {
      res.status(404).json({ json: "No hotels found of the given category" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ json: "Failed to fetch the hotel through category" });
  }
});

async function getHotelByPriceRange(priceRange) {
  try {
    const hotel = await Hotel.find({ priceRange: priceRange });
    console.log(hotel);
  } catch (error) {
    console.log(error);
  }
}

async function getHotelByRatings(rating) {
  try {
    const hotel = await Hotel.find({ rating: rating });
    return hotel;
  } catch (error) {
    console.log(error);
  }
}

app.get("/hotels/rating/:hotelRating", async (req, res) => {
  try {
    const hotels = await getHotelByRatings(req.params.hotelRating);
    if (hotels.length != 0) {
      res.json(hotels);
    } else {
      res.status(404).json("No Hotels Found.");
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch the hotels." });
  }
});

async function getHotelByPhoneNum(phoneNum) {
  try {
    const hotel = await Hotel.find({ phoneNumber: phoneNum });
    return hotel;
  } catch (error) {
    console.log(error);
  }
}

app.get("/hotels/directory/:phoneNumber", async (req, res) => {
  try {
    const hotels = await getHotelByPhoneNum(req.params.phoneNumber);
    if (hotels.length != 0) {
      res.json(hotels);
    } else {
      res.status(404).json("No Hotelss Found");
    }
  } catch (error) {
    res.status(404).json({ error: "Failed to fetch the hotel." });
  }
});

async function updateHotelById(id, updateData) {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    return updatedHotel;
  } catch (error) {
    console.log(error);
  }
}

app.post("/hotels/:hotelsId", async (req, res) => {
  try {
    const updatedHotel = await updateHotelById(req.params.hotelsId, req.body);
    if (updatedHotel) {
      res.status(200).json({
        message: "Hotel updated successfully.",
        updatedHoteL: updatedHotel,
      });
    } else {
      res.status(404).json({ error: "Hotel not found." });
    }
  } catch (error) {
    res.status(404).json({ error: "Failed to update the hotel." });
  }
});

async function updateHotelByName(hotelName, updateData) {
  try {
    const updatedHotel = await Hotel.findOneAndUpdate(
      { name: hotelName },
      updateData,
      { new: true }
    );
    console.log(updatedHotel);
  } catch (error) {
    console.log(error);
  }
}

async function updateHotelByPhoneNum(num, updateData) {
  try {
    const updatedHotel = await Hotel.findOneAndUpdate(
      { phoneNumber: num },
      updateData,
      { new: true }
    );
    console.log(updatedHotel);
  } catch (error) {
    console.log(error);
  }
}

async function deleteHotelById(id) {
  try {
    const deletedHotel = await Hotel.findByIdAndDelete(id);
    console.log("Deleted Hotel: ", deletedHotel);
  } catch (error) {
    console.log(error);
  }
}

app.delete("/hotels/:hotelId", async (req, res) => {
  try {
    const deletedHotel = await deleteHotelById(req.params.hotelId);
    res.status(200).json({ message: "Hotel deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete the hotel." });
  }
});

async function deleteHotelByPhoneNumber(phoneNum) {
  try {
    const deletedHotel = await Hotel.findOneAndDelete({
      phoneNumber: phoneNum,
    });
    console.log(deletedHotel);
  } catch (error) {
    console.log(error);
  }
}

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is runnin on ${PORT}`);
});

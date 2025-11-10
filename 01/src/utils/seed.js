import dotenv from "dotenv";
dotenv.config();
import connectDB from "../config/db.js";
import Package from "../models/Package.js";
import Partner from "../models/Partner.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

async function run() {
  await connectDB();

  await Package.deleteMany({});
  await Partner.deleteMany({});
  await Order.deleteMany({});
  await User.deleteMany({});

  const pkgs = await Package.insertMany([
    {
      name: "Birthday Bash Basic",
      category: "Birthday",
      price: 999,
      image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800",
      description: "Perfect starter package with colorful balloons, birthday banners, and basic decorations",
      items: ["20 Balloons", "Happy Birthday Banner", "Table Decoration", "Party Hats"],
      setup_time: "45 minutes",
      rating: 4.5
    },
    {
      name: "Birthday Deluxe",
      category: "Birthday",
      price: 1499,
      image: "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=800",
      description: "Premium birthday setup with balloons, backdrop, lighting and cake table",
      items: ["30 Balloons", "Photo Backdrop", "LED String Lights", "Cake Table Setup", "Party Props"],
      setup_time: "60 minutes",
      rating: 4.8
    },
    {
      name: "Anniversary Romance",
      category: "Anniversary",
      price: 1299,
      image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800",
      description: "Romantic anniversary setup with roses, candles, and elegant decorations",
      items: ["Rose Petals", "Scented Candles", "Romantic Backdrop", "Heart Balloons", "Photo Frame"],
      setup_time: "45 minutes",
      rating: 4.7
    },
    {
      name: "Kids Theme Party",
      category: "Birthday",
      price: 1199,
      image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800",
      description: "Colorful kids theme party with cartoon decorations and fun elements",
      items: ["Theme Balloons", "Cartoon Banners", "Activity Props", "Colorful Streamers", "Party Favors"],
      setup_time: "50 minutes",
      rating: 4.6
    },
    {
      name: "Surprise Party Special",
      category: "Surprise",
      price: 899,
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800",
      description: "Quick surprise setup that creates maximum impact in minimum time",
      items: ["15 Balloons", "Surprise Banner", "Confetti", "Photo Props"],
      setup_time: "30 minutes",
      rating: 4.4
    }
  ]);

  const partners = await Partner.insertMany([
    {
      name: "Ravi Kumar", phone: "+91 9123456780", rating: 4.8,
      total_deliveries: 145, status: "active",
      current_location: "HSR Layout, Bangalore", earnings_today: 850
    },
    {
      name: "Sneha Singh", phone: "+91 9234567891", rating: 4.7,
      total_deliveries: 98, status: "active",
      current_location: "Koramangala, Bangalore", earnings_today: 1200
    },
    {
      name: "Arjun Reddy", phone: "+91 9345678902", rating: 4.9,
      total_deliveries: 201, status: "offline",
      current_location: "Electronic City, Bangalore", earnings_today: 0
    }
  ]);

  await User.create({
    name: "Priya Sharma",
    phone: "+91 9876543210",
    address: "A-102, Green Park Society, HSR Layout, Bangalore - 560102",
    role: "customer"
  });

  // sample orders
  await Order.insertMany([
    {
      customer_name: "Priya Sharma",
      package: "Birthday Deluxe",
      package_id: pkgs[1]._id,
      address: "A-102, Green Park Society, HSR Layout, Bangalore - 560102",
      phone: "+91 9876543210",
      date: "2025-09-16",
      time_slot: "6:00 PM - 7:00 PM",
      status: "confirmed",
      price: 1499,
      partner_assigned: "Ravi Kumar",
      partner_id: partners[0]._id,
      special_instructions: "Setup for 7-year-old, use cartoon theme"
    },
    {
      customer_name: "Amit Patel",
      package: "Anniversary Romance",
      package_id: pkgs[2]._id,
      address: "301, Sunrise Apartments, Koramangala, Bangalore - 560095",
      phone: "+91 8765432109",
      date: "2025-09-17",
      time_slot: "7:00 PM - 8:00 PM",
      status: "in_transit",
      price: 1299,
      partner_assigned: "Sneha Singh",
      partner_id: partners[1]._id,
      special_instructions: "Keep it very romantic, surprise for wife"
    }
  ]);

  console.log("✅ Seed completed.");
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });

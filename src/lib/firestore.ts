import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { app } from "./firebase";
import { sendEmail } from "./email";

const db = getFirestore(app);

export async function submitBooking(data: any) {
  try {
    // Convert date to ISO string to avoid Firebase custom object error
    const bookingData = {
      ...data,
      date: data.date ? new Date(data.date).toISOString() : null,
      status: "pending",
      createdAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(collection(db, "bookings"), bookingData);
    
    // Send email notification
    try {
      await sendEmail('booking_notification', data);
    } catch (err) {
      // Email failed but booking still saved
    }
    
    return docRef;
  } catch (error) {
    throw new Error(`Booking submission failed: ${error}`);
  }
}

export async function getBookings() {
  try {
    const snapshot = await getDocs(collection(db, "bookings"));
    const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return bookings;
  } catch (error) {
    return [];
  }
}

export async function acceptBooking(id: string) {
  try {
    const bookingRef = doc(db, "bookings", id);
    await updateDoc(bookingRef, { 
      status: "accepted",
      processedAt: new Date()
    });
    console.log("Booking accepted:", id);
  } catch (error) {
    console.error("Error accepting booking:", error);
    throw new Error("Failed to accept booking. Please try again.");
  }
}

export async function rejectBooking(id: string) {
  try {
    const bookingRef = doc(db, "bookings", id);
    await updateDoc(bookingRef, { 
      status: "rejected",
      processedAt: new Date()
    });
    console.log("Booking rejected:", id);
  } catch (error) {
    console.error("Error rejecting booking:", error);
    throw new Error("Failed to reject booking. Please try again.");
  }
}

export async function deleteBooking(id: string) {
  try {
    const bookingRef = doc(db, "bookings", id);
    await deleteDoc(bookingRef);
    console.log("Booking deleted:", id);
  } catch (error) {
    console.error("Error deleting booking:", error);
    throw new Error("Failed to delete booking. Please try again.");
  }
}

export { db };
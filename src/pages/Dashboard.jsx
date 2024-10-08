import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../components/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import tokenImage from "../assets/token.png";
import userimg from "../assets/user-png-33842.png"
import { useWallet } from '../context/WalletContext';

function Dashboard() {
  const [greenCredits, setGreenCredits] = useState(0);
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();
  const { walletBalance } = useWallet();


  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
          setGreenCredits(docSnap.data().credits); // Fetch the credits from Firestore
        } else {
          console.log("User document not found");
        }
      } else {
        console.log("User is not logged in");
      }
    });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/signin");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">User Dashboard</h1>
      <div className="w-full max-w-3xl">
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6 flex flex-col items-center">
          <div className="flex justify-center mb-4">
            <img
              src={userimg}
              alt="Token"
              className="w-32 h-32 rounded-full border-4 border-green-600"
            />
          </div>
          <h2 className="text-3xl font-semibold text-gray-800 mb-2">Welcome, {userDetails?.firstName}!</h2>
          <p className="text-lg text-gray-600 mb-4">Manage your profile and view your green credits.</p>
          <div className="flex flex-col items-center">
          
            <div className="bg-blue-600 text-white p-4 rounded-lg shadow-md mb-4 w-full text-center">
              <h3 className="text-2xl font-bold">Wallet: </h3>
              <p className="text-4xl font-extrabold mt-2 flex items-center justify-center">
                {userDetails?.wallet || 0}
                {walletBalance}
                <img
                  src={tokenImage}
                  alt="Token"
                  className="w-9 h-9 rounded-full border-4 border-green-600 ml-2"
                />
              </p>
            </div>
            <button
              className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
        {userDetails ? (
          <div className="bg-white shadow-lg rounded-lg p-6 w-full">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">User Information</h3>
            <p className="text-lg text-gray-600"><strong>Email:</strong> {userDetails.email}</p>
            <p className="text-lg text-gray-600"><strong>First Name:</strong> {userDetails.firstName}</p>
            <p className="text-lg text-gray-600"><strong>Last Name:</strong> {userDetails.lastName}</p>
          </div>
        ) : (
          <p className="text-xl text-gray-800 text-center mt-4">Loading...</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

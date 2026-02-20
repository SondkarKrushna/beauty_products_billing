// import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Layout from "./componants/Layout";
// import CreateInvoice from "./componants/invoice/CreateInvoice";
// import DashboardInfo from "./pages/DashboardInfo";
// import Invoices from "./pages/Invoice";
// import Products from "./pages/Products";
// import ProductDetails from "./pages/ProductDetails";
// import Bill from "./pages/Bill";
// import Revenue from "./pages/Revenue";
// import SignIn from "./pages/SignIn";

// const App = () => {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Layout />}>
//           <Route index element={<DashboardInfo />} />
//           <Route path="invoices" element={<Invoices />} />
//           <Route path="createInvoices" element={<CreateInvoice />} />
//           <Route path="products" element={<Products />} />
//           <Route path="productsDetails" element={<ProductDetails />} />
//           <Route path="bill" element={<Bill />} />
//           <Route path="revenue" element={<Revenue />} />
//           <Route path="signIn" element={<SignIn />} />
//         </Route>

//         <Route path='*' element={<h1>Page Not Found</h1>} />
//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default App;

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./componants/Layout";
import CreateInvoice from "./componants/invoice/CreateInvoice";
import DashboardInfo from "./pages/DashboardInfo";
import Invoices from "./pages/Invoice";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Bill from "./pages/Bill";
import Bills from "../src/pages/Bills";
import Revenue from "./pages/Revenue";
import SignIn from "./pages/SignIn";
import { Provider } from "react-redux";
import reduxStore from "./redux/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <Provider store={reduxStore}>
  
        <Routes>
          <Route path="/" element={<SignIn />} />

          <Route path="/app" element={<Layout />}>
            <Route index element={<DashboardInfo />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="createInvoices" element={<CreateInvoice />} />
            <Route path="products" element={<Products />} />
            <Route path="productsDetails" element={<ProductDetails />} />
            <Route path="bill" element={<Bills />} />
            <Route path="bill/:id" element={<Bill />} />
            <Route path="revenue" element={<Revenue />} />
          </Route>

          <Route path="*" element={<h1>Page Not Found</h1>} />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
        />
 
    </Provider>
  );
};

export default App;

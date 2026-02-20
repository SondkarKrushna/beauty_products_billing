import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useCreateInvoiceMutation } from "../../redux/apis/adminApi"
import { toast } from "react-toastify";

const BASE_URL = "https://beauty-products-backend.onrender.com";

const CreateInvoice = () => {
  const navigate = useNavigate();
  const [productsList, setProductsList] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [searchText, setSearchText] = useState({});
  const [selectedProducts, setSelectedProducts] = useState({});
  const [createInvoice] = useCreateInvoiceMutation();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      customerName: "",
      phone: "",
      address: "",
      paymentMethod: "",
      products: [{ product_Id: "", product_quantity: 1, tax: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  const watchProducts = watch("products");


  useEffect(() => {
    fetch(`${BASE_URL}/api/biling_software/get/names`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.success) setProductsList(data.data);
      });
  }, []);

  const calculateTotals = () => {
    let items = 0,
      subtotal = 0,
      tax = 0;

    watchProducts.forEach((row) => {
      const qty = Number(row.product_quantity) || 0;
      const price = productsList.find((p) => p.productId === row.product_Id)
        ?.productPrice || 0;
      const rowSubtotal = qty * price;
      const rowTax = Math.round((rowSubtotal * (Number(row.tax) || 0)) / 100);

      items += qty;
      subtotal += rowSubtotal;
      tax += rowTax;
    });

    return {
      items,
      subtotal,
      tax,
      grandTotal: subtotal + tax,
    };
  };

  {
    errors.customerName && (
      <p className="text-red-500 text-xs">{errors.customerName.message}</p>
    )
  }

  {
    errors.phone && (
      <p className="text-red-500 text-xs">{errors.phone.message}</p>
    )
  }

  {
    errors.address && (
      <p className="text-red-500 text-xs">{errors.address.message}</p>
    )
  }

  const totals = calculateTotals();

  const handleProductSelect = (idx, product) => {
    setValue(`products.${idx}.product_Id`, product.productId);
    setSearchText({ ...searchText, [idx]: product.productName });

    setSelectedProducts({
      ...selectedProducts,
      [idx]: product,
    });

    setOpenIndex(null);
  };

  const handleAddProduct = () => {
    append({ product_Id: "", product_quantity: 1, tax: 0 });
  };

  const handleRemoveProduct = (idx) => {
    if (fields.length === 1) return;
    remove(idx);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setValue("phone", value);
  };

  const onSubmit = async (data) => {
    const payload = {
      customer_name: data.customerName,
      phone: data.phone,
      address: data.address,
      payment_method: data.paymentMethod,
      product_details: data.products.map((p) => ({
        product_Id: p.product_Id,
        product_quantity: Number(p.product_quantity) || 1,
        tax: Number(p.tax) || 0,
      })),
    };

    try {
      const result = await createInvoice(payload).unwrap();

      toast.success("Invoice created successfully");

      navigate("/app/bill", {
        state: { invoice: result.data },
      });

    } catch (err) {
      toast.error("Product out of Stock");
    }
  };


  return (
    <div className="w-full flex justify-center px-2 sm:px-4 py-4">
      <div className="w-full max-w-6xl bg-white p-4 sm:p-6 rounded-xl shadow-sm">
        <div className="text-xl font-semibold text-[#000000] mb-4">
          Create Invoice
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Customer Info */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Customer Name */}
            <div className="flex-1  min-w-[200px]">
              <input
                type="text"
                placeholder="Enter Name"
                className={`w-full h-10 rounded-md border pl-4 ${errors.customerName ? "border-red-500" : ""
                  }`}
                {...register("customerName", {
                  required: "Customer name is required",
                })}
              />
              {errors.customerName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.customerName.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="w-full">
              <input
                type="tel"
                placeholder="Phone No"
                className={`w-full h-10 rounded-md border pl-4 ${errors.phone ? "border-red-500" : ""
                  }`}
                {...register("phone", {
                  required: "Phone number is required",
                  minLength: { value: 10, message: "Phone must be 10 digits" },
                  maxLength: { value: 10, message: "Phone must be 10 digits" },
                })}
                onChange={handlePhoneChange}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="w-full">
              <input
                type="text"
                placeholder="Address"
                className={`w-full h-10 rounded-md border pl-4 ${errors.address ? "border-red-500" : ""
                  }`}
                {...register("address", {
                  required: "Address is required",
                })}
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>
          </div>

          <div className="relative">
            <div className="hidden sm:grid grid-cols-4 gap-4 mt-5 text-sm font-semibold bg-[#FF007B1A] p-3 rounded-t-md">
              <div>Product</div>
              <div>Quantity</div>
              <div>Tax %</div>
              <div>Total</div>
            </div>

            {fields.map((row, idx) => (

              <div
                key={row.id}
                className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-3 items-start sm:items-center border sm:border-none p-3 sm:p-0 rounded-md sm:rounded-none"
              >
                {/* ✅ Product */}
                <div className="flex flex-col">
                  <span className="sm:hidden text-xs font-semibold mb-1">Product</span>

                  <div className="relative w-full overflow-visible">
                    <div
                      className={`relative flex items-center h-10 border rounded-md px-2 cursor-pointer bg-white
        ${errors.products?.[idx]?.product_Id
                          ? "border-red-500"
                          : "border-[#FF007B4D]"
                        }`}
                      onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                    >
                      <input
                        type="text"
                        placeholder="Select product"
                        className="flex-1 outline-none text-sm pr-6 bg-transparent"
                        value={searchText[idx] || ""}
                        onChange={(e) =>
                          setSearchText({
                            ...searchText,
                            [idx]: e.target.value,
                          })
                        }
                        onFocus={() => setOpenIndex(idx)}
                      />

                      <svg
                        className="absolute right-2 w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>

                    {openIndex === idx && (
                      <div className="absolute left-0 right-0 mt-1 z-[9999] bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                        {productsList
                          .filter((p) =>
                            p.productName
                              .toLowerCase()
                              .includes((searchText[idx] || "").toLowerCase())
                          )
                          .map((p) => (
                            <div
                              key={p.productId}
                              className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
                              onClick={() => handleProductSelect(idx, p)}
                            >
                              {p.productName}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* ✅ Quantity */}
                <div className="flex flex-col">
                  <span className="sm:hidden text-xs font-semibold mb-1">Quantity</span>
                  <input
                    type="number"
                    min={1}
                    placeholder="Qty"
                    className="w-full h-10 border border-[#FF007B4D] rounded-md pl-4"
                    {...register(`products.${idx}.product_quantity`, {
                      required: "Quantity is required",
                      min: { value: 1, message: "Minimum quantity is 1" },
                      validate: (value) => {
                        const available = selectedProducts[idx]?.productQuantity || 0;
                        return (
                          value <= available || `Only ${available} items available`
                        );
                      },
                    })}
                  />
                </div>

                {/* ✅ Tax */}
                <div className="flex flex-col">
                  <span className="sm:hidden text-xs font-semibold mb-1">Tax %</span>
                  <input
                    type="number"
                    min={0}
                    placeholder="Tax"
                    className="w-full h-10 border border-[#FF007B4D] rounded-md pl-4"
                    {...register(`products.${idx}.tax`, { min: 0 })}
                  />
                </div>

                {/* ✅ Total (with extra gap from Tax) */}
                <div className="flex flex-col sm:ml-6">
                  <span className="sm:hidden text-xs font-semibold mb-1">Total</span>

                  <div className="text-center font-semibold flex justify-between items-center gap-2 h-10">
                    <span>
                      ₹
                      {(() => {
                        const qty =
                          Number(getValues(`products.${idx}.product_quantity`)) || 0;
                        const price =
                          productsList.find(
                            (p) =>
                              p.productId ===
                              getValues(`products.${idx}.product_Id`)
                          )?.productPrice || 0;
                        const tax =
                          Number(getValues(`products.${idx}.tax`)) || 0;

                        return qty * price + Math.round((qty * price * tax) / 100);
                      })()}
                    </span>

                    {fields.length > 1 && (
                      <button
                        type="button"
                        className="px-2 py-1 text-xs bg-[#FF007B] text-white rounded"
                        onClick={() => handleRemoveProduct(idx)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Product */}
          <div className="mt-4 w-full sm:w-[130px] h-[36px] flex justify-center items-center rounded-md text-white bg-gradient-to-l from-[#FF007B] to-[#99004A]">
            <button type="button" onClick={handleAddProduct} disabled={isSubmitting}>
              Add Item
            </button>
          </div>

          {/* Totals */}
          <div className="bg-white border rounded-md mt-5 p-4 space-y-2">
            <div className="flex justify-between">
              <span>Items</span>
              <span className="font-semibold">{totals.items}</span>
            </div>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">₹{totals.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax Charges</span>
              <span className="font-semibold">₹{totals.tax}</span>
            </div>
            <div className="flex justify-between text-white p-2 bg-[#FF007B] rounded-md">
              <span className="font-semibold">Grand Total</span>
              <span className="font-semibold">₹{totals.grandTotal}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="flex flex-col gap-2 mt-5">
            <span className="text-[#000000] font-semibold">Payment Method</span>

            <div className="flex flex-wrap gap-6">
              <label className="flex items-center text-[#000000] gap-2">
                <input
                  type="radio"
                  value="cash"
                  {...register("paymentMethod", {
                    required: "Payment method is required",
                  })}
                />
                Cash on Delivery
              </label>

              <label className="flex items-center text-[#000000] gap-2">
                <input
                  type="radio"
                  value="online"
                  {...register("paymentMethod", {
                    required: "Payment method is required",
                  })}
                />
                Online Payment
              </label>
            </div>

            {/* ✅ Error Message */}
            {errors.paymentMethod && (
              <p className="text-red-500 text-xs mt-1">
                {errors.paymentMethod.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row justify-end mt-6 gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full sm:w-[173px] h-[44px] rounded-md text-white flex justify-center items-center
              ${isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-l from-[#FF007B] to-[#99004A]"
                }`}
            >
              {isSubmitting ? "Saving..." : "Save & Download"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateInvoice;

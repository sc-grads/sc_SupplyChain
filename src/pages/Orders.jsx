import React from "react";
import Layout from "../components/Layout";

const Orders = () => {
  return (
    <Layout>
      <div className="max-w-[1280px] mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-6">
          <a
            className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-primary"
            href="#"
          >
            Orders
          </a>
          <span className="text-gray-500 dark:text-gray-500 text-sm">/</span>
          <span className="text-[#121714] dark:text-white text-sm font-bold">
            Order #ES-4029
          </span>
        </nav>

        {/* Page Heading & Top Actions */}
        <div className="flex flex-wrap justify-between items-end gap-6 mb-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <h1 className="text-[#121714] dark:text-white text-3xl lg:text-4xl font-black tracking-tight">
                Order #ES-4029
              </h1>
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20 uppercase tracking-wider">
                Confirmed
              </span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Riverside Cafe • Placed on Oct 12, 2023
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center justify-center rounded-lg h-12 px-6 bg-white dark:bg-[#2c353d] text-[#121714] dark:text-white text-sm font-bold border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
              <span>Edit Order</span>
            </button>
            <button className="flex items-center justify-center rounded-lg h-12 px-6 bg-risk-amber text-black text-sm font-bold shadow-lg shadow-risk-amber/20 hover:brightness-105 transition-all">
              <span className="material-symbols-outlined mr-2">warning</span>
              <span>Delivery at Risk</span>
            </button>
            <button className="flex items-center justify-center rounded-lg h-12 px-6 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:brightness-105 transition-all">
              <span className="material-symbols-outlined mr-2">
                check_circle
              </span>
              <span>Mark Delivered</span>
            </button>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column: Order Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tabs */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="flex border-b border-gray-200 dark:border-gray-800 px-6 gap-8">
                <a
                  className="flex items-center border-b-[3px] border-primary text-primary pb-4 pt-5 px-1 font-bold text-sm tracking-wide"
                  href="#"
                >
                  Items (5)
                </a>
                <a
                  className="flex items-center border-b-[3px] border-transparent text-gray-500 dark:text-gray-400 pb-4 pt-5 px-1 font-bold text-sm hover:text-primary transition-colors"
                  href="#"
                >
                  Logistics
                </a>
                <a
                  className="flex items-center border-b-[3px] border-transparent text-gray-500 dark:text-gray-400 pb-4 pt-5 px-1 font-bold text-sm hover:text-primary transition-colors"
                  href="#"
                >
                  Documents
                </a>
              </div>
              {/* Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-background-light dark:bg-[#2c353d] border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-[11px] uppercase font-black tracking-widest">
                      <th className="px-6 py-4">Product</th>
                      <th className="px-6 py-4">SKU</th>
                      <th className="px-6 py-4 text-center">Qty</th>
                      <th className="px-6 py-4 text-right">Unit Price</th>
                      <th className="px-6 py-4 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded bg-background-light dark:bg-[#1f262e] border border-gray-200 dark:border-gray-700 bg-cover bg-center"
                          data-alt="Whole Bean Espresso"
                          style={{
                            backgroundImage:
                              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBfd-WIsXuEToguLF2jkdaz5idOwod342WfM_KRInoY4qaBwXXi1O5_6gj6O0b8zFooWVjH1nOATQDEwjBpSyESEuj5JhoK9UKWAOHUS8FxSIpE-Qub_6FgURoB07K2L_sdaAhMqoo9vzGW0Dmp1Uat7X2OBJzPyf5Fel5P34OaiLqpLGw6f5mEb0FpoRKyTWkPj4PKM-dzL3DIHD-E_53l--c2kZL5L7PmUmo8rG_lp7PTW-YMoqIuDBM1VAodYo_14lhTKxzDFcWX')",
                          }}
                        ></div>
                        <span className="font-bold text-sm">
                          Whole Bean Espresso (1kg)
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">
                        COF-001-EB
                      </td>
                      <td className="px-6 py-4 text-center font-bold">12</td>
                      <td className="px-6 py-4 text-right text-sm">$24.00</td>
                      <td className="px-6 py-4 text-right font-bold text-sm">
                        $288.00
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded bg-background-light dark:bg-[#1f262e] border border-gray-200 dark:border-gray-700 bg-cover bg-center"
                          data-alt="Organic Almond Milk"
                          style={{
                            backgroundImage:
                              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAKTRewDH-XKOkgrc688ILk2suYFsoZFw12qxnrVWiH2VbXtnOHolZvhaavhXDewJmkOAKEeJNqXqmXMTH1nQk3dsgXjPqP5Q4O0N7EVuWTV2_eV5fm7YWteEJI1kzM-qrm_j1e9E1_MgMmIRhu8NqHm2L_OdlD02qz0ot_Ef7BLkwjd9Tb6rKai3ZOOXUpFmxXEXQOHb7avt7hqPZV7xvbRf7vuqLUSOJG9v46jVitLZpD4pWw-jP17uAAQ-z2xPNjznUfxhzSjUiW')",
                          }}
                        ></div>
                        <span className="font-bold text-sm">
                          Organic Almond Milk (1L)
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">
                        DAI-023-AM
                      </td>
                      <td className="px-6 py-4 text-center font-bold">48</td>
                      <td className="px-6 py-4 text-right text-sm">$4.50</td>
                      <td className="px-6 py-4 text-right font-bold text-sm">
                        $216.00
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded bg-background-light dark:bg-[#1f262e] border border-gray-200 dark:border-gray-700 bg-cover bg-center"
                          data-alt="White Sugar Cubes"
                          style={{
                            backgroundImage:
                              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA-VzsxCDTZqXx4sRt6M21GMsia60QyRQhSJxLPomks2nSoRQT7om_1LcSS2e0JtX1QYDZAM1PDlm_eNOApIdIfFcFPRTWUJtt3XcAZI6yxSnjA6-BSm0LcAX9xz8nKFCbtejAJKNf9TOP1JVA_m37MP8z79M8jHNS8qt-8JEZJIIoZghM6UlvJsm6K9tB6_vF9myqji2Ta8Pl0UyRNeZQQvoEMG0C5Lcpf2vw-DBJfhIC2PuxAptIiDJ8Fd6Qvo3H4zJ0zOPNZSrM1')",
                          }}
                        ></div>
                        <span className="font-bold text-sm">
                          White Sugar Cubes (500g)
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">
                        PAN-005-SG
                      </td>
                      <td className="px-6 py-4 text-center font-bold">10</td>
                      <td className="px-6 py-4 text-right text-sm">$2.10</td>
                      <td className="px-6 py-4 text-right font-bold text-sm">
                        $21.00
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* Summary Area */}
              <div className="p-6 bg-background-light/30 dark:bg-background-dark flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-gray-500 dark:text-gray-400 text-sm">
                    <span>Subtotal</span>
                    <span>$525.00</span>
                  </div>
                  <div className="flex justify-between text-gray-500 dark:text-gray-400 text-sm">
                    <span>Tax (8%)</span>
                    <span>$42.00</span>
                  </div>
                  <div className="flex justify-between text-[#121714] dark:text-white font-black text-xl border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                    <span>Total</span>
                    <span>$567.00</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Logistics Overview Mockup */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-lg text-primary">
                  <span className="material-symbols-outlined">
                    local_shipping
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-black tracking-widest">
                    Courier
                  </p>
                  <p className="font-bold">SwiftLogistics Express</p>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-lg text-primary">
                  <span className="material-symbols-outlined">
                    calendar_today
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-black tracking-widest">
                    Estimated Delivery
                  </p>
                  <p className="font-bold">Oct 14, 2023 (10:00 - 14:00)</p>
                </div>
              </div>
            </div>
          </div>
          {/* Sidebar: Delivery Info & Activity Timeline */}
          <div className="space-y-6">
            {/* Delivery Info Card */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-widest mb-4">
                Delivery Info
              </h3>
              <div className="space-y-6">
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-gray-500">
                    location_on
                  </span>
                  <div>
                    <p className="text-sm font-bold">Shipping Address</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mt-1">
                      Riverside Cafe
                      <br />
                      123 River Road, Suite 101
                      <br />
                      Port City, PC 54321
                    </p>
                  </div>
                </div>
                <hr className="border-gray-200 dark:border-gray-700" />
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-gray-500">
                    person
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-bold">Point of Contact</p>
                    <p className="text-sm font-medium mt-1">
                      John Doe (Manager)
                    </p>
                    <div className="mt-3 flex flex-col gap-2">
                      <button className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/10 px-3 py-2 rounded-lg w-full justify-center border border-primary/20">
                        <span className="material-symbols-outlined text-sm">
                          call
                        </span>
                        +1 555-0199
                      </button>
                      <button className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-background-light dark:bg-[#2c353d] px-3 py-2 rounded-lg w-full justify-center border border-gray-200 dark:border-gray-700">
                        <span className="material-symbols-outlined text-sm">
                          mail
                        </span>
                        Contact via Email
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Activity Timeline */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-widest mb-6">
                Activity Timeline
              </h3>
              <div className="relative space-y-8 pl-8 before:content-[''] before:absolute before:left-[11px] before:top-1 before:h-[calc(100%-12px)] before:w-0.5 before:bg-gray-200 dark:before:bg-gray-700">
                {/* Step 1 (Active) */}
                <div className="relative">
                  <div className="absolute -left-[30px] top-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white border-4 border-white dark:border-background-dark z-10">
                    <span className="material-symbols-outlined text-xs font-bold">
                      check
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold">Order Confirmed</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Oct 12, 2023 • 11:30 AM
                    </p>
                    <p className="text-xs mt-1 text-gray-500">
                      Confirmed by Sales Team
                    </p>
                  </div>
                </div>
                {/* Step 2 */}
                <div className="relative">
                  <div className="absolute -left-[30px] top-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary border-4 border-white dark:border-background-dark z-10">
                    <span className="material-symbols-outlined text-xs font-bold">
                      shopping_cart
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold">Order Placed</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Oct 12, 2023 • 10:00 AM
                    </p>
                    <p className="text-xs mt-1 text-gray-500">
                      Placed via Web Portal
                    </p>
                  </div>
                </div>
                {/* Future Steps */}
                <div className="relative opacity-40">
                  <div className="absolute -left-[30px] top-0 w-6 h-6 rounded-full bg-background-light dark:bg-[#2c353d] flex items-center justify-center text-gray-500 border-4 border-white dark:border-background-dark z-10">
                    <span className="material-symbols-outlined text-xs font-bold">
                      inventory_2
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold">Picking & Packing</p>
                    <p className="text-xs text-gray-500">Scheduled</p>
                  </div>
                </div>
                <div className="relative opacity-40">
                  <div className="absolute -left-[30px] top-0 w-6 h-6 rounded-full bg-background-light dark:bg-[#2c353d] flex items-center justify-center text-gray-500 border-4 border-white dark:border-background-dark z-10">
                    <span className="material-symbols-outlined text-xs font-bold">
                      local_shipping
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold">Out for Delivery</p>
                    <p className="text-xs text-gray-500">Awaiting Carrier</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;

// app/admin/page.tsx

import React from "react";
import db from "@/lib/db";
import { formatCurrency, formatNumber } from "@/lib/formatters";

async function getUserData() {
  const [userCount, orderData] = await Promise.all([
    db.user.count(),
    db.order.aggregate({ _sum: { pricePaidInCents: true } }),
  ]);

  return {
    userCount,
    averageValuePerUser:
      userCount === 0
        ? 0
        : (orderData._sum.pricePaidInCents || 0) / userCount / 100,
  };
}

async function getSalesData() {
  const data = await db.order.aggregate({
    _sum: { pricePaidInCents: true },
    _count: true,
  });

  await wait(2000);

  return {
    amount: (data._sum.pricePaidInCents || 0) / 100,
    numberOfSales: data._count,
  };
}

function wait(duration: number) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

async function getProductData() {
  const [activeCount, inactiveCount] = await Promise.all([
    db.product.count({ where: { isAvailable: true } }),
    db.product.count({ where: { isAvailable: false } }),
  ]);

  return {
    activeCount,
    inactiveCount,
  };
}

export default async function AdminDashboard() {
  const [salesData, userData, productData] = await Promise.all([
    getSalesData(),
    getUserData(),
    getProductData(),
  ]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-6">
      <DashboardCard
        title="Sales"
        subtitle={`${formatNumber(salesData.numberOfSales)} Orders`}
        body={formatCurrency(salesData.amount)}
      />
      <DashboardCard
        title="Customers"
        subtitle={`${formatCurrency(
          userData.averageValuePerUser
        )} Avg/User`}
        body={formatNumber(userData.userCount)}
      />
      <DashboardCard
        title="Active Products"
        subtitle={`${formatNumber(productData.inactiveCount)} Inactive`}
        body={formatNumber(productData.activeCount)}
      />
    </div>
  );
}

type DashboardCardProps = {
  title: string;
  subtitle: string;
  body: string;
};

function DashboardCard({ title, subtitle, body }: DashboardCardProps) {
  return (
    <div
      className="
        flex flex-col
        bg-secondaryBg
        border border-borderBg
        rounded-2xl
        shadow-lg
        px-6 py-8
        transition-transform duration-300
        hover:scale-[1.02] hover:shadow-2xl hover:border-borderBg/70
      "
    >
      <header className="mb-4">
        <h2 className="text-3xl font-extrabold text-textHeading">{title}</h2>
        <p className="text-sm text-textPrimary/70">{subtitle}</p>
      </header>
      <div className="mt-auto">
        <p className="text-4xl font-bold text-textHeading">{body}</p>
      </div>
    </div>
  );
}

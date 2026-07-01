import { getOrders } from "@/lib/orders-actions";
import Header from "@/components/Header";
import AdminNav from "@/components/AdminNav";
import OrdersTable from "@/components/OrdersTable";
import styles from "@/app/admin/page.module.css";
export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <>
      <Header />
      <main className={styles.adminPage}>
        <div className="container">
          
          <header className={styles.header}>
            <div>
              <div className={styles.tag}>Gestione Vendite</div>
              <h1>Ordini Clienti</h1>
            </div>
          </header>

          <AdminNav />

          <section className={styles.section} style={{ marginTop: '24px' }}>
            <div className={styles.sectionHeader}>
              <h2>Tutti gli Ordini</h2>
            </div>

            <OrdersTable initialOrders={orders} />
          </section>

        </div>
      </main>
    </>
  );
}

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "./page.module.css";
import LoginForm from "@/components/LoginForm";
import ProfileDashboard from "./ProfileDashboard";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { redirect } from "next/navigation";

export default async function AccountPage() {
  const session = await auth();
  let dbUser = null;

  if (session?.user?.email) {
    const res = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
    dbUser = res[0];
  }

  return (
    <>
      <Header />
      <main className={styles.accountPage}>
        <div className={styles.heroBg}>
          <div className={styles.circle1}></div>
          <div className={styles.circle2}></div>
        </div>

        <div className={styles.container}>
          {dbUser ? (
            <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                  <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Benvenuto, {dbUser.name}</h1>
                  <p style={{ color: 'var(--stone-d)' }}>Gestisci i tuoi ordini e i tuoi dati fiscali.</p>
                </div>
                <form action={async () => { "use server"; const { signOut } = await import("@/auth"); await signOut(); redirect("/"); }}>
                  <button type="submit" className="btn btn-outline" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <LogOut size={16} /> Esci
                  </button>
                </form>
              </div>
              <ProfileDashboard user={dbUser} />
            </div>
          ) : (
            <>
              <div className={styles.loginCard}>
                <div className={styles.cardHeader}>
                  <h1>Area Riservata</h1>
                  <p>Accedi per gestire lo store Acoustic May</p>
                </div>

                <LoginForm />

                <div className={styles.divider}>
                  <span>oppure</span>
                </div>

                <div className={styles.registerPrompt}>
                  <p>Non hai ancora un account?</p>
                  <Link href="/registrati" className="btn btn-ghost w-full" style={{ display: 'block', textAlign: 'center' }}>
                    Crea un account artigiano
                  </Link>
                </div>
              </div>

              <div className={styles.benefits}>
                <h3>Perché registrarsi?</h3>
                <div className={styles.benefitList}>
                  <div className={styles.benefitItem}>
                    <div className={styles.icon}>📦</div>
                    <div>
                      <h4>Traccia i tuoi ordini</h4>
                      <p>Segui ogni fase della creazione e spedizione del tuo diffusore.</p>
                    </div>
                  </div>
                  <div className={styles.benefitItem}>
                    <div className={styles.icon}>🛠️</div>
                    <div>
                      <h4>Assistenza Prioritaria</h4>
                      <p>Canale diretto con il laboratorio per manutenzione e consigli.</p>
                    </div>
                  </div>
                  <div className={styles.benefitItem}>
                    <div className={styles.icon}>✨</div>
                    <div>
                      <h4>Anteprime Esclusive</h4>
                      <p>Accesso anticipato alle nuove serie limitate e prototipi.</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

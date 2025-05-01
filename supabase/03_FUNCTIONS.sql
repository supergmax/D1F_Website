-- =====================================================
-- 03_FUNCTIONS.SQL
-- Base de données D1F - DayOneFunded
-- Description : Fonctions métiers (archivage, reset, etc.)
-- =====================================================

-- =====================================================
-- Fonction : log_monthly_history()
-- Archive mensuellement les performances, gains/pertes
-- =====================================================
CREATE OR REPLACE FUNCTION log_monthly_history()
RETURNS void AS $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT
      u.id AS user_id,
      c.id AS challenge_id,
      TO_CHAR(current_date, 'YYYY-MM') AS month,
      COALESCE(SUM(cr.daily_gain), 0) AS gain,
      COALESCE(SUM(cr.daily_loss), 0) AS loss,
      u.token_balance AS balance,
      (
        SELECT COUNT(*) FROM purchases p
        WHERE p.user_id = u.id
          AND TO_CHAR(p.created_at, 'YYYY-MM') = TO_CHAR(current_date, 'YYYY-MM')
      ) AS purchase_count,
      (
        SELECT COUNT(*) FROM payouts p
        WHERE p.user_id = u.id
          AND TO_CHAR(p.requested_at, 'YYYY-MM') = TO_CHAR(current_date, 'YYYY-MM')
      ) AS payout_count,
      (
        SELECT COUNT(*) FROM invoices i
        WHERE i.user_id = u.id
          AND TO_CHAR(i.created_at, 'YYYY-MM') = TO_CHAR(current_date, 'YYYY-MM')
      ) AS invoice_count,
      (
        SELECT COUNT(*) FROM affiliations a
        WHERE a.affiliate_id = u.affiliate_id
          AND TO_CHAR(a.created_at, 'YYYY-MM') = TO_CHAR(current_date, 'YYYY-MM')
      ) AS affil_count
    FROM users u
    JOIN challenges c ON c.user_id = u.id
    LEFT JOIN challenge_results cr ON cr.challenge_id = c.id
      AND DATE_TRUNC('month', cr.date) = DATE_TRUNC('month', CURRENT_DATE)
    GROUP BY u.id, c.id
  LOOP
    INSERT INTO history (
      user_id,
      challenge_id,
      month,
      total_gain,
      total_loss,
      token_balance_snapshot,
      purchases,
      payouts,
      invoices,
      affiliate_count
    )
    VALUES (
      r.user_id,
      r.challenge_id,
      r.month,
      r.gain,
      r.loss,
      r.balance,
      r.purchase_count,
      r.payout_count,
      r.invoice_count,
      r.affil_count
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
COMMENT ON FUNCTION log_monthly_history IS 'Archive mensuelle des performances (lecture uniquement pour admin).';

-- =====================================================
-- Fonction : reset_monthly_perfs()
-- Supprime les données de résultats pour un nouveau cycle
-- =====================================================
CREATE OR REPLACE FUNCTION reset_monthly_perfs()
RETURNS void AS $$
BEGIN
  -- Archive d'abord avant reset (sécurité assurée par rôle serveur)
  PERFORM log_monthly_history();

  -- Remise à zéro des profits cumulés
  UPDATE challenges SET profit = 0;

  -- Suppression des résultats du mois courant
  DELETE FROM challenge_results
  WHERE DATE_TRUNC('month', date) = DATE_TRUNC('month', CURRENT_DATE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
COMMENT ON FUNCTION reset_monthly_perfs IS 'Réinitialise les performances du mois après archivage (usage API uniquement).';

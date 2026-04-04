package com.example.emploiDuTemps.repository;

import com.example.emploiDuTemps.entity.PlanningHebdomadaire;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PlanningHebdomadaireRepository extends JpaRepository<PlanningHebdomadaire, Integer> {
    Optional<PlanningHebdomadaire> findFirstByFiliereIdAndStatutOrderByDateDebutDesc(Integer filiereId, PlanningHebdomadaire.Statut statut);
}

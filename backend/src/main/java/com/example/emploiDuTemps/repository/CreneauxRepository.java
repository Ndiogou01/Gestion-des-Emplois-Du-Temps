package com.example.emploiDuTemps.repository;

import com.example.emploiDuTemps.entity.Creneaux;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

@Repository
public interface CreneauxRepository extends JpaRepository<Creneaux, Integer> {
    List<Creneaux> findByPlanningHebdomadaireId(Integer planningHebdomadaireId);
    @Query("""
    SELECT c FROM Creneaux c
    WHERE c.date = :date
    AND (
        c.planningHebdomadaire.filiere.id = :filiereId
        OR (:enseignantId IS NOT NULL AND c.enseignant.id = :enseignantId)
        OR (:salleId IS NOT NULL AND c.salle.id = :salleId)
    )
    AND (
        (:heureDebut < c.heureFin AND :heureFin > c.heureDebut)
        OR (:heureDebut <= c.heureDebut AND :heureFin >= c.heureFin)
        OR (c.heureDebut <= :heureDebut AND c.heureFin >= :heureFin)
    )
""")
    List<Creneaux> findConflits(
            @Param("date") LocalDate date,
            @Param("heureDebut") LocalTime heureDebut,
            @Param("heureFin") LocalTime heureFin,
            @Param("enseignantId") Integer enseignantId,
            @Param("salleId") Integer salleId,
            @Param("filiereId") Integer filiereId
    );
}
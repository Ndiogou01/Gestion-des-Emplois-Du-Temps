package com.example.emploiDuTemps.repository;

import com.example.emploiDuTemps.dto.FiliereCoursDto;
import com.example.emploiDuTemps.dto.SuiviCoursDto;
import com.example.emploiDuTemps.entity.SuiviCours;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SuiviCoursRepository extends JpaRepository<SuiviCours, Long> {
    List<SuiviCours> findByCoursId(Long coursId);
    List<SuiviCours> findByEnseignantId(Long enseignantId);
    List<SuiviCours> findByCreneauId(Long creneauId);
    List<SuiviCours> findByFiliereId(Long filiereId);

    @Query("SELECT new com.example.emploiDuTemps.dto.FiliereCoursDto(" +
            "fc.id, " +
            "fc.filiere.id, " +
            "fc.cours.id, " +
            "COALESCE(SUM(sc.duree), 0), " +
            "fc.volumeHoraireTotal, " +
            "fc.cours.nomCours, " +
            "fc.cours.typeDeCours) " +
            "FROM FiliereCours fc " +
            "LEFT JOIN SuiviCours sc ON sc.cours.id = fc.cours.id AND sc.filiere.id = fc.filiere.id " +
            "WHERE fc.filiere.id = :filiereId " +
            "GROUP BY fc.id, fc.filiere.id, fc.cours.id, fc.volumeHoraireTotal, fc.cours.nomCours, fc.cours.typeDeCours")
    List<FiliereCoursDto> findProgressionByFiliere(@Param("filiereId") Long filiereId);

}

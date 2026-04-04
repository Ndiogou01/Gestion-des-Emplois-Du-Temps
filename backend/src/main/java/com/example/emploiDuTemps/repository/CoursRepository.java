package com.example.emploiDuTemps.repository;

import com.example.emploiDuTemps.entity.Cours;
import com.example.emploiDuTemps.entity.FiliereCours;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CoursRepository extends JpaRepository<Cours, Integer> {
    @Query("SELECT fc.cours FROM FiliereCours fc WHERE fc.filiere.id = :filiereId")
    List<Cours> findByFiliereId(@Param("filiereId") Integer filiereId);
}
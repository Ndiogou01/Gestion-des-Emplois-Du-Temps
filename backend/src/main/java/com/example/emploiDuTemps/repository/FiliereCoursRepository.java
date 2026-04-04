package com.example.emploiDuTemps.repository;

import com.example.emploiDuTemps.entity.FiliereCours;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FiliereCoursRepository extends JpaRepository<FiliereCours, Integer> {
    List<FiliereCours> findByFiliereId(Integer filiereId);
}
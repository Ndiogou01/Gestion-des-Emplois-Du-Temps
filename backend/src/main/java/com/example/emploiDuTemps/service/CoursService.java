package com.example.emploiDuTemps.service;

import com.example.emploiDuTemps.entity.Cours;
import com.example.emploiDuTemps.entity.FiliereCours;
import com.example.emploiDuTemps.exception.ResourceNotFoundException;
import com.example.emploiDuTemps.repository.CoursRepository;
import com.example.emploiDuTemps.repository.FiliereCoursRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class CoursService {

    private final CoursRepository repo;
    private final FiliereCoursRepository filiereCoursRepo;

    public CoursService(CoursRepository repo, FiliereCoursRepository filiereCoursRepo) {
        this.filiereCoursRepo = filiereCoursRepo;
        this.repo = repo;
    }

    public List<Cours> getAll() {
        return repo.findAll();
    }

    public Cours getById(Integer id) {
        return repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Cours", id));
    }

    @Transactional
    public Cours create(Cours cours) {
        return repo.save(cours);
    }

    @Transactional
    public Cours update(Integer id, Cours newCours) {
        return repo.findById(id).map(cours -> {
            cours.setNomCours(newCours.getNomCours());
            cours.setTypeDeCours(newCours.getTypeDeCours());
            cours.setEnseignantResponsable(newCours.getEnseignantResponsable());
            cours.setFiliereCours(newCours.getFiliereCours());
            return repo.save(cours);
        }).orElseGet(() -> {
            newCours.setId(id);
            return repo.save(newCours);
        });
    }

    @Transactional
    public void delete(Integer id) {
        repo.deleteById(id);
    }

    @Transactional
    public List<Cours> getByFiliere(Integer filiereId) {
        return repo.findByFiliereId(filiereId);
    }

    @Transactional
    public List<Cours> getAllDistinct() {
        return repo.findAll()
                .stream()
                .collect(Collectors.toMap(
                        Cours::getNomCours, // clé = nomCours
                        c -> c,             // valeur = cours
                        (existing, replacement) -> existing // si doublon, garde le premier
                ))
                .values()
                .stream()
                .collect(Collectors.toList());
    }
}
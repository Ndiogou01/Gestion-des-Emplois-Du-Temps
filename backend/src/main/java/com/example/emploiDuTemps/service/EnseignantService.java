package com.example.emploiDuTemps.service;

import com.example.emploiDuTemps.entity.Cours;
import com.example.emploiDuTemps.entity.Enseignant;
import com.example.emploiDuTemps.exception.ResourceNotFoundException;
import com.example.emploiDuTemps.repository.CoursRepository;
import com.example.emploiDuTemps.repository.EnseignantRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class EnseignantService {

    private final EnseignantRepository repo;
    private final CoursRepository coursRepo;

    public EnseignantService(EnseignantRepository repo, CoursRepository coursRepo) {
        this.coursRepo = coursRepo;
        this.repo = repo;
    }

    public List<Enseignant> getAll() {
        return repo.findAll();
    }

    public Enseignant getById(Integer id) {
        return repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Enseignant", id));
    }

    @Transactional
    public Enseignant create(Enseignant enseignant) {
        return repo.save(enseignant);
    }

    @Transactional
    public Enseignant update(Integer id, Enseignant newEnseignant) {
        return repo.findById(id).map(enseignant -> {
            enseignant.setNomEnseignant(newEnseignant.getNomEnseignant());
            enseignant.setPrenomEnseignant(newEnseignant.getPrenomEnseignant());
            enseignant.setSpecialite(newEnseignant.getSpecialite());
            enseignant.setDepartement(newEnseignant.getDepartement());
            enseignant.setEmailEnseignant(newEnseignant.getEmailEnseignant());
            return repo.save(enseignant);
        }).orElseGet(() -> {
            newEnseignant.setId(id);
            return repo.save(newEnseignant);
        });
    }

    @Transactional
    public List<Enseignant> getByFiliere(Integer filiereId) {
        List<Cours> cours = coursRepo.findByFiliereId(filiereId);
        return repo.findAll()
                .stream()
                .filter(e -> cours.stream().anyMatch(c -> c.getEnseignantResponsable().getId().equals(e.getId())))
                .collect(Collectors.toList());
    }


    @Transactional
    public void delete(Integer id) {
        repo.deleteById(id);
    }
}
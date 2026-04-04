package com.example.emploiDuTemps.service;

import com.example.emploiDuTemps.entity.Filiere;
import com.example.emploiDuTemps.exception.ResourceNotFoundException;
import com.example.emploiDuTemps.repository.FiliereRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FiliereService {

    private final FiliereRepository repo;

    public FiliereService(FiliereRepository repo) {
        this.repo = repo;
    }

    public List<Filiere> getAll() {
        return repo.findAll();
    }

    public Filiere getById(Integer id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Filiere", id));
    }

    @Transactional
    public Filiere create(Filiere filiere) {
        return repo.save(filiere);
    }

    @Transactional
    public Filiere update(Integer id, Filiere newFiliere) {
        return repo.findById(id).map(filiere -> {
            filiere.setNomFiliere(newFiliere.getNomFiliere());
            filiere.setNomFiliere(newFiliere.getNomFiliere());
            filiere.setFiliereCours(newFiliere.getFiliereCours());
            return repo.save(filiere);
        }).orElseGet(() -> {
            newFiliere.setId(id);
            return repo.save(newFiliere);
        });
    }

    @Transactional
    public void delete(Integer id) {
        repo.deleteById(id);
    }
}
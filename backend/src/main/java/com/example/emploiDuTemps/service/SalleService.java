package com.example.emploiDuTemps.service;

import com.example.emploiDuTemps.entity.Salle;
import com.example.emploiDuTemps.exception.ResourceNotFoundException;
import com.example.emploiDuTemps.repository.SalleRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SalleService {

    private final SalleRepository repo;

    public SalleService(SalleRepository repo) {
        this.repo = repo;
    }

    public List<Salle> getAll() {
        return repo.findAll();
    }

    public Salle getById(Integer id) {
        return repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Salle", id));
    }

    @Transactional
    public Salle create(Salle salle) {
        return repo.save(salle);
    }

    @Transactional
    public Salle update(Integer id, Salle newSalle) {
        return repo.findById(id).map(salle -> {
            salle.setNomSalle(newSalle.getNomSalle());
            return repo.save(salle);
        }).orElseGet(() -> {
            newSalle.setId(id);
            return repo.save(newSalle);
        });
    }

    @Transactional
    public void delete(Integer id) {
        repo.deleteById(id);
    }
}
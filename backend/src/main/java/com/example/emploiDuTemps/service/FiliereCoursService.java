package com.example.emploiDuTemps.service;

import com.example.emploiDuTemps.entity.Cours;
import com.example.emploiDuTemps.entity.FiliereCours;
import com.example.emploiDuTemps.repository.FiliereCoursRepository;
import com.example.emploiDuTemps.exception.ResourceNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import java.util.List;


@Service
public class FiliereCoursService {

    private final FiliereCoursRepository repo;

    public FiliereCoursService(FiliereCoursRepository repo) {
        this.repo = repo;
    }

    public List<FiliereCours> getAll() {
        return repo.findAll();
    }

    public FiliereCours getById(Integer id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FiliereCours", id));
    }

    @Transactional
    public FiliereCours create(FiliereCours filiereCours) {
        return repo.save(filiereCours);
    }

    @Transactional
    public FiliereCours update(Integer id, FiliereCours newFiliereCours) {
        return repo.findById(id).map(fc -> {
            fc.setFiliere(newFiliereCours.getFiliere());
            fc.setCours(newFiliereCours.getCours());
            fc.setVolumeHoraireTotal(newFiliereCours.getVolumeHoraireTotal());
            return repo.save(fc);
        }).orElseGet(() -> {
            newFiliereCours.setId(id);
            return repo.save(newFiliereCours);
        });
    }

    @Transactional
    public void delete(Integer id) {
        repo.deleteById(id);
    }
}
package com.example.emploiDuTemps.service;

import com.example.emploiDuTemps.entity.Creneaux;
import com.example.emploiDuTemps.exception.ResourceNotFoundException;
import com.example.emploiDuTemps.repository.CreneauxRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import java.util.List;


@Service
public class CreneauxService {

    private final CreneauxRepository repo;

    public CreneauxService(CreneauxRepository repo) {
        this.repo = repo;
    }

    public List<Creneaux> getAll() {
        return repo.findAll();
    }

    public Creneaux getById(Integer id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Creneaux", id));
    }

    @Transactional
    public Creneaux create(Creneaux creneaux) {
        validateHoraire(creneaux);
        if (hasConflit(creneaux)) {
            throw new IllegalArgumentException("Conflit détecté avec un autre créneau.");
        }
        return repo.save(creneaux);
    }


    @Transactional
    public Creneaux update(Integer id, Creneaux newCreneaux) {
        validateHoraire(newCreneaux);
        if (hasConflit(newCreneaux)) {
            throw new IllegalArgumentException("Conflit détecté avec un autre créneau.");
        }
        return repo.findById(id).map(creneau -> {
            creneau.setDate(newCreneaux.getDate());
            creneau.setHeureDebut(newCreneaux.getHeureDebut());
            creneau.setHeureFin(newCreneaux.getHeureFin());
            creneau.setCours(newCreneaux.getCours());
            creneau.setEnseignant(newCreneaux.getEnseignant());
            creneau.setSalle(newCreneaux.getSalle());
            return repo.save(creneau);
        }).orElseGet(() -> {
            newCreneaux.setId(id);
            return repo.save(newCreneaux);
        });
    }

    @Transactional
    public void delete(Integer id) {
        repo.deleteById(id);
    }

    @Transactional
    public List<Creneaux> getByPlanningHebdomadaireId(Integer planningId) {
        return repo.findByPlanningHebdomadaireId(planningId);
    }

    private void validateHoraire(Creneaux creneau) {
        if (creneau.getHeureDebut().isBefore(java.time.LocalTime.of(8, 0)) ||
                creneau.getHeureFin().isAfter(java.time.LocalTime.of(20, 0))) {
            throw new IllegalArgumentException("Les créneaux doivent être entre 08h00 et 20h00.");
        }
        if (!creneau.getHeureFin().isAfter(creneau.getHeureDebut())) {
            throw new IllegalArgumentException("L'heure de fin doit être après l'heure de début.");
        }
    }


    public boolean hasConflit(Creneaux creneau) {
        List<Creneaux> conflits = repo.findConflits(
                creneau.getDate(),
                creneau.getHeureDebut(),
                creneau.getHeureFin(),
                creneau.getEnseignant() != null ? creneau.getEnseignant().getId() : null,
                creneau.getSalle() != null ? creneau.getSalle().getId() : null,
                creneau.getPlanningHebdomadaire().getFiliere().getId()
        );

        if (creneau.getId() != null) {
            conflits = conflits.stream()
                    .filter(c -> !c.getId().equals(creneau.getId()))
                    .toList();
        }

        return !conflits.isEmpty();
    }

}
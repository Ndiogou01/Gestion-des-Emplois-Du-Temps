package com.example.emploiDuTemps.service;

import com.example.emploiDuTemps.entity.PlanningHebdomadaire;
import com.example.emploiDuTemps.exception.ResourceNotFoundException;
import com.example.emploiDuTemps.repository.PlanningHebdomadaireRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PlanningHebdomadaireService {

    private final PlanningHebdomadaireRepository planningRepository;

    public PlanningHebdomadaireService(PlanningHebdomadaireRepository planningRepository) {
        this.planningRepository = planningRepository;
    }

    public List<PlanningHebdomadaire> getAll() {
        return planningRepository.findAll();
    }

    public PlanningHebdomadaire getById(Integer id) {
        return planningRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PlanningHebdomadaire", id));
    }

    @Transactional
    public PlanningHebdomadaire create(PlanningHebdomadaire planning) {
        return planningRepository.save(planning);
    }

    @Transactional
    public PlanningHebdomadaire update(Integer id, PlanningHebdomadaire newPlanning) {
        return planningRepository.findById(id).map(existing -> {
            existing.setFiliere(newPlanning.getFiliere());
            existing.setSemaineAnnee(newPlanning.getSemaineAnnee());
            existing.setDateDebut(newPlanning.getDateDebut());
            existing.setDateFin(newPlanning.getDateFin());
            existing.setStatut(newPlanning.getStatut());
            existing.setSemestre(newPlanning.getSemestre());
            return planningRepository.save(existing);
        }).orElseThrow(() -> new ResourceNotFoundException("PlanningHebdomadaire", id));
    }

    @Transactional
    public void delete(Integer id) {
        planningRepository.deleteById(id);
    }

    @Transactional
    public PlanningHebdomadaire getPlanningActifByFiliere(Integer filiereId) {
        return planningRepository
                .findFirstByFiliereIdAndStatutOrderByDateDebutDesc(filiereId, PlanningHebdomadaire.Statut.actif)
                .orElseThrow(() -> new ResourceNotFoundException("PlanningHebdomadaire actif pour la filière", filiereId));
    }

}

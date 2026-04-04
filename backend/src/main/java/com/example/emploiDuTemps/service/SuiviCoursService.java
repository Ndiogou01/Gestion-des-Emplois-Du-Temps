package com.example.emploiDuTemps.service;
import com.example.emploiDuTemps.dto.FiliereCoursDto;
import com.example.emploiDuTemps.entity.SuiviCours;
import com.example.emploiDuTemps.repository.SuiviCoursRepository;
import com.example.emploiDuTemps.dto.SuiviCoursDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SuiviCoursService {

    private final SuiviCoursRepository repository;

    public SuiviCoursService(SuiviCoursRepository repository) {
        this.repository = repository;
    }

    public List<SuiviCoursDto> getAll() {
        return repository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public SuiviCoursDto getById(Long id) {
        return repository.findById(id).map(this::toDto).orElse(null);
    }

    public SuiviCoursDto save(SuiviCours suiviCours) {
        return toDto(repository.save(suiviCours));
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    private SuiviCoursDto toDto(SuiviCours entity) {
        SuiviCoursDto dto = new SuiviCoursDto();
        dto.setId(entity.getId());
        dto.setCoursId(entity.getCours().getId());
        dto.setNomCours(entity.getCours().getNomCours());
        dto.setDateCours(entity.getDateCours());
        dto.setDuree(entity.getDuree());
        dto.setTypeDeCours(entity.getTypeDeCours());
        dto.setEnseignantId(entity.getEnseignant().getId());
        dto.setFiliereId(entity.getFiliere().getId());
        dto.setEnseignantNom(entity.getEnseignant().getPrenomEnseignant() + " " + entity.getEnseignant().getNomEnseignant());
        if (entity.getCreneau() != null) dto.setCreneauId(entity.getCreneau().getId());
        return dto;
    }

    public List<FiliereCoursDto> getProgressionByFiliere(Long filiereId) {
        return repository.findProgressionByFiliere(filiereId);
    }


}

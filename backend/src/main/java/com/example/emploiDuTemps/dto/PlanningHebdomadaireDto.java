package com.example.emploiDuTemps.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class PlanningHebdomadaireDto {
    private Integer id;
    private Integer filiereId;
    private String semaineAnnee;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private String statut;
    private String semestre;
    private LocalDateTime dateCreation;

    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }

    public void setSemestre(String semestre) {
        this.semestre = semestre;
    }

    public String getSemestre() {
        return semestre;
    }

    public Integer getFiliereId() {
        return filiereId;
    }

    public void setFiliereId(Integer filiereId) {
        this.filiereId = filiereId;
    }

    public String getSemaineAnnee() {
        return semaineAnnee;
    }
    public void setSemaineAnnee(String semaineAnnee) {
        this.semaineAnnee = semaineAnnee;
    }

    public LocalDate getDateDebut() {
        return dateDebut;
    }
    public void setDateDebut(LocalDate dateDebut) {
        this.dateDebut = dateDebut;
    }

    public LocalDate getDateFin() {
        return dateFin;
    }
    public void setDateFin(LocalDate dateFin) {
        this.dateFin = dateFin;
    }

    public String getStatut() {
        return statut;
    }
    public void setStatut(String statut) {
        this.statut = statut;
    }

    public LocalDateTime getDateCreation() {
        return dateCreation;
    }
    public void setDateCreation(LocalDateTime dateCreation) {
        this.dateCreation = dateCreation;
    }
}

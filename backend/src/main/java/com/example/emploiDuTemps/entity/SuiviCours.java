package com.example.emploiDuTemps.entity;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "suivi_cours")
public class SuiviCours {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "cours_id", nullable = false)
    private Cours cours;

    @Column(name = "date_cours", nullable = false)
    private LocalDate dateCours;

    @Column(name = "duree", nullable = false)
    private Integer duree;

    @Column(name = "type_de_cours")
    private String typeDeCours;

    @ManyToOne
    @JoinColumn(name = "enseignant_id", nullable = false)
    private Enseignant enseignant;

    @ManyToOne
    @JoinColumn(name = "creneau_id")
    private Creneaux creneau;

    @ManyToOne
    @JoinColumn(name = "filiere_id")
    private Filiere filiere;

    public Filiere getFiliere() {
        return filiere;
    }

    public void setFiliere(Filiere filiere) {
        this.filiere = filiere;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Cours getCours() {
        return cours;
    }

    public void setCours(Cours cours) {
        this.cours = cours;
    }

    public LocalDate getDateCours() {
        return dateCours;
    }

    public void setDateCours(LocalDate dateCours) {
        this.dateCours = dateCours;
    }

    public Integer getDuree() {
        return duree;
    }

    public void setDuree(Integer duree) {
        this.duree = duree;
    }

    public String getTypeDeCours() {
        return typeDeCours;
    }

    public void setTypeDeCours(String typeDeCours) {
        this.typeDeCours = typeDeCours;
    }

    public Enseignant getEnseignant() {
        return enseignant;
    }

    public void setEnseignant(Enseignant enseignant) {
        this.enseignant = enseignant;
    }

    public Creneaux getCreneau() {
        return creneau;
    }

    public void setCreneau(Creneaux creneau) {
        this.creneau = creneau;
    }
}


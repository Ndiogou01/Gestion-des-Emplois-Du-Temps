package com.example.emploiDuTemps.entity;
import jakarta.persistence.*;
import java.util.List;
import com.example.emploiDuTemps.entity.Type;


@Entity
public class Cours {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String nomCours;
    private String typeDeCours;
    @ManyToOne
    private Enseignant enseignantResponsable;
    @OneToMany(mappedBy = "cours")
    private List<FiliereCours> filiereCours;

    public Cours() {}

    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }

    public String getNomCours() {
        return nomCours;
    }
    public void setNomCours(String nomCours) {
        this.nomCours = nomCours;
    }

    public Enseignant getEnseignantResponsable() {
        return enseignantResponsable;
    }
    public void setEnseignantResponsable(Enseignant enseignantResponsable) {
        this.enseignantResponsable = enseignantResponsable;
    }

    public String getTypeDeCours() {
        return typeDeCours;
    }
    public void setTypeDeCours(String typeDeCours) {
        this.typeDeCours = typeDeCours;
    }


    public List<FiliereCours> getFiliereCours() {
        return filiereCours;
    }

    public void setFiliereCours(List<FiliereCours> filiereCours) {
        this.filiereCours = filiereCours;
    }

}

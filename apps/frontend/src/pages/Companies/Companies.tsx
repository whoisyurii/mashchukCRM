import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CompaniesCard } from "../../components/companies/CompaniesCard";
import { Plus } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../contexts/AuthContext";
import { useCompaniesQuery } from "../../hooks/useCompaniesQuery";

export const Companies: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // debounce input
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchInput);
    }, 650);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // useCompaniesQuery hook
  const { data, isLoading } = useCompaniesQuery({
    page,
    search,
    sortBy,
    sortOrder,
    limit: 5,
  });

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Companies</h1>
          <p className="text-gray-400 mt-1">Manage your company portfolio</p>
        </div>
        {(user?.role === "SuperAdmin" || user?.role === "Admin") && (
          <Button onClick={() => navigate("/companies/add-new")}>
            <Plus className="w-4 h-4 mr-2" />
            New Company
          </Button>
        )}
      </div>
      <CompaniesCard
        data={data}
        isLoading={isLoading}
        searchInput={searchInput}
        handleSearch={handleSearch}
        handleSort={handleSort}
        sortBy={sortBy}
        sortOrder={sortOrder}
        page={page}
        setPage={setPage}
      />
    </div>
  );
};
